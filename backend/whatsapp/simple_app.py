"""
WhatsApp Automation - Versão Simplificada com Crop de QR Code
"""

import os
import time
import base64
import threading
from io import BytesIO
from flask import Flask, request, jsonify
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from PIL import Image

app = Flask(__name__)
CORS(app)

driver = None
is_authenticated = False
driver_lock = threading.Lock()

def init_driver():
    global driver
    if driver:
        return driver
    
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    
    data_dir = os.path.abspath("./whatsapp_data")
    os.makedirs(data_dir, exist_ok=True)
    options.add_argument(f"--user-data-dir={data_dir}")
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    print("✓ Chrome headless iniciado")
    return driver

@app.route('/api/whatsapp/connect', methods=['POST'])
def connect():
    global is_authenticated, driver
    
    with driver_lock:
        try:
            print("📱 Conectando WhatsApp...")
            
            if driver and is_authenticated:
                return jsonify({'status': 'already_authenticated'})
            
            browser = init_driver()
            browser.get("https://web.whatsapp.com")
            print("⏳ Aguardando página...")
            time.sleep(5)
            
            # Verificar se já autenticado
            try:
                WebDriverWait(browser, 3).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "div[contenteditable='true'][data-tab='3']"))
                )
                is_authenticated = True
                return jsonify({'status': 'already_authenticated'})
            except:
                pass
            
            print("📸 Capturando QR Code...")
            
            # Pegar screenshot completo
            screenshot_png = browser.get_screenshot_as_png()
            img = Image.open(BytesIO(screenshot_png))
            width, height = img.size
            print(f"📐 Página: {width}x{height}")
            
            # Recortar área do QR Code (zoom MÁXIMO)
            # Calcular área quadrada bem pequena = MUITO MAIS ZOOM
            qr_size = int(width * 0.08)  # Área ainda menor = ZOOM MÁXIMO (8% da largura)
            
            # Centro do QR Code (ajuste fino: +2% direita, +5% baixo)
            center_x = int(width * 0.69)  # 69% da largura (+2% = 67% + 2%)
            center_y = int(height * 0.55) # 55% da altura (+5% = 50% + 5%)
            
            # Calcular coordenadas para crop quadrado centralizado
            left = center_x - qr_size
            top = center_y - qr_size
            right = center_x + qr_size
            bottom = center_y + qr_size
            
            qr_crop = img.crop((left, top, right, bottom))
            
            # Redimensionar para 600x600 (maior e mais nítido)
            qr_crop = qr_crop.resize((600, 600), Image.Resampling.LANCZOS)
            
            # Converter para base64
            buffer = BytesIO()
            qr_crop.save(buffer, format='PNG')
            qr_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
            qr_data_url = f"data:image/png;base64,{qr_base64}"
            
            print("✓ QR Code capturado e otimizado!")
            
            return jsonify({
                'status': 'waiting_qr',
                'qr_code': qr_data_url
            })
            
        except Exception as e:
            print(f"✗ Erro: {e}")
            return jsonify({'error': str(e)}), 500

@app.route('/api/whatsapp/status', methods=['GET'])
def status():
    global driver, is_authenticated
    
    if not driver:
        return jsonify({'connected': False})
    
    try:
        driver.find_element(By.CSS_SELECTOR, "div[contenteditable='true'][data-tab='3']")
        is_authenticated = True
        return jsonify({'connected': True})
    except:
        is_authenticated = False
        return jsonify({'connected': False})

@app.route('/api/whatsapp/send', methods=['POST'])
def send():
    global driver, is_authenticated
    
    if not driver or not is_authenticated:
        return jsonify({'error': 'NOT_CONNECTED'}), 401
    
    try:
        data = request.get_json()
        phone = data.get('phone_number')
        message = data.get('message')
        
        print(f"📤 Enviando para {phone}...")
        
        url = f"https://web.whatsapp.com/send?phone=55{phone}"
        driver.get(url)
        
        message_box = WebDriverWait(driver, 30).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "div[contenteditable='true'][data-tab='10']"))
        )
        
        message_box.send_keys(message)
        time.sleep(1)
        
        send_button = driver.find_element(By.CSS_SELECTOR, "button[aria-label='Send']")
        send_button.click()
        
        time.sleep(2)
        print("✓ Enviado!")
        
        return jsonify({'success': True})
        
    except Exception as e:
        print(f"✗ Erro: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    print("""
    ╔══════════════════════════════════════════════════════════╗
    ║  WhatsApp Automation - QR Code Otimizado                ║
    ║  Servidor: http://localhost:5000                         ║
    ╚══════════════════════════════════════════════════════════╝
    """)
    app.run(host='0.0.0.0', port=5000, debug=False)
