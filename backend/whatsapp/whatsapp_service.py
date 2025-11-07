"""
WhatsApp Automation Service
Gerencia conexão, autenticação e envio de mensagens via WhatsApp Web
"""

import os
import json
import time
import base64
from io import BytesIO
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from PIL import Image
from cryptography.fernet import Fernet


class WhatsAppService:
    """Serviço de automação do WhatsApp Web"""
    
    def __init__(self, profile_dir="./whatsapp_profile", encryption_key=None):
        self.driver = None
        self.profile_dir = profile_dir
        self.session_file = os.path.join(profile_dir, "session.json")
        self.is_authenticated = False
        self.user_data = None
        
        # Criptografia
        if encryption_key:
            self.cipher = Fernet(encryption_key.encode())
        else:
            self.cipher = None
        
        # Criar diretório de perfil se não existir
        os.makedirs(profile_dir, exist_ok=True)
    
    def initialize_driver(self, headless=True):
        """Inicializa o Selenium WebDriver com perfil persistente"""
        try:
            # Se já existe um driver, não criar outro
            if self.driver:
                print("✓ Driver já inicializado, reutilizando")
                return True
            
            options = Options()
            
            # Configurar perfil persistente
            options.add_argument(f"--user-data-dir={self.profile_dir}")
            options.add_argument("--profile-directory=Default")
            
            # Configurações adicionais
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--disable-blink-features=AutomationControlled")
            options.add_argument("--disable-gpu")
            options.add_experimental_option("excludeSwitches", ["enable-automation"])
            options.add_experimental_option('useAutomationExtension', False)
            
            # Modo headless desabilitado temporariamente devido a crashes no Windows
            # TODO: Investigar alternativas (Docker, WSL, ou Puppeteer)
            # options.add_argument("--headless")
            
            options.add_argument("--window-size=1920,1080")
            options.add_argument("--disable-extensions")
            options.add_argument("--disable-logging")
            options.add_argument("--log-level=3")
            options.add_argument("--disable-logging")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--no-first-run")
            options.add_argument("--no-service-autorun")
            options.add_argument("--password-store=basic")
            options.add_argument("--use-mock-keychain")
            options.add_argument("--disable-setuid-sandbox")
            options.add_argument("--single-process")  # Importante para Windows
            options.add_argument("--disable-background-networking")
            
            # Desabilitar notificações
            prefs = {
                "profile.default_content_setting_values.notifications": 2
            }
            options.add_experimental_option("prefs", prefs)
            
            # Inicializar driver
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=options)
            
            print("✓ WebDriver inicializado com sucesso")
            return True
            
        except Exception as e:
            print(f"✗ Erro ao inicializar WebDriver: {e}")
            return False
    
    def get_qr_code(self, timeout=30):
        """Captura o QR Code do WhatsApp Web e retorna como base64"""
        try:
            print("→ Iniciando captura de QR Code...")
            
            if not self.driver:
                print("→ Inicializando driver...")
                success = self.initialize_driver()
                if not success or not self.driver:
                    raise Exception("Falha ao inicializar driver")
            
            # Acessar WhatsApp Web
            print("→ Acessando WhatsApp Web...")
            self.driver.get("https://web.whatsapp.com")
            
            # Aguardar página carregar
            print("→ Aguardando página carregar...")
            time.sleep(5)
            
            # Aguardar QR Code aparecer
            wait = WebDriverWait(self.driver, timeout)
            
            # Tentar encontrar o canvas do QR Code
            try:
                print("→ Procurando elemento do QR Code...")
                
                # Tentar múltiplos seletores para encontrar o QR Code
                qr_selectors = [
                    "canvas[aria-label*='Scan']",
                    "canvas[aria-label*='scan']",
                    "canvas[role='img']",
                    "div[data-ref] canvas",
                    "canvas"
                ]
                
                qr_element = None
                for selector in qr_selectors:
                    try:
                        qr_element = wait.until(
                            EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                        )
                        print(f"→ QR Code encontrado com seletor: {selector}")
                        break
                    except:
                        continue
                
                if not qr_element:
                    raise Exception("Nenhum canvas de QR Code encontrado")
                
                # Aguardar um pouco para garantir que o QR Code foi renderizado
                time.sleep(2)
                
                # Método 1: Tentar extrair data URL diretamente do canvas (mais confiável)
                try:
                    print("→ Tentando extrair QR Code diretamente do canvas...")
                    qr_data_url = self.driver.execute_script("""
                        var canvas = arguments[0];
                        return canvas.toDataURL('image/png');
                    """, qr_element)
                    
                    if qr_data_url and qr_data_url.startswith('data:image'):
                        print("✓ QR Code extraído diretamente do canvas")
                        return qr_data_url
                except Exception as e:
                    print(f"→ Extração direta falhou: {e}")
                
                # Método 2: Screenshot como fallback
                print("→ Usando screenshot como fallback...")
                qr_png = qr_element.screenshot_as_png
                
                # Processar imagem para garantir qualidade
                img = Image.open(BytesIO(qr_png))
                
                # Salvar em buffer com qualidade máxima
                buffer = BytesIO()
                img.save(buffer, format='PNG', optimize=False, quality=100)
                buffer.seek(0)
                
                # Converter para base64
                qr_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
                qr_data_url = f"data:image/png;base64,{qr_base64}"
                
                print("✓ QR Code capturado com sucesso")
                return qr_data_url
                
            except TimeoutException:
                # Pode já estar autenticado
                if self.check_if_authenticated():
                    print("✓ Já autenticado, QR Code não necessário")
                    return None
                else:
                    raise Exception("QR Code não encontrado e não está autenticado")
                    
        except Exception as e:
            print(f"✗ Erro ao capturar QR Code: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    def check_if_authenticated(self):
        """Verifica se já está autenticado no WhatsApp Web"""
        try:
            # Procurar por elementos que só aparecem quando autenticado
            wait = WebDriverWait(self.driver, 5)
            
            # Tentar encontrar a barra de busca (presente quando autenticado)
            wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "div[contenteditable='true'][data-tab='3']"))
            )
            
            return True
            
        except (TimeoutException, NoSuchElementException):
            return False
    
    def wait_for_authentication(self, timeout=60, callback=None):
        """Aguarda o usuário escanear o QR Code"""
        try:
            start_time = time.time()
            
            while time.time() - start_time < timeout:
                if self.check_if_authenticated():
                    # Autenticado com sucesso
                    self.is_authenticated = True
                    
                    # Obter dados do usuário
                    self.user_data = self.get_user_data()
                    
                    # Salvar sessão
                    self.save_session()
                    
                    print("✓ Autenticação bem-sucedida")
                    
                    if callback:
                        callback(self.user_data)
                    
                    return True
                
                time.sleep(1)
            
            print("✗ Timeout aguardando autenticação")
            return False
            
        except Exception as e:
            print(f"✗ Erro aguardando autenticação: {e}")
            return False
    
    def get_user_data(self):
        """Obtém dados do usuário autenticado"""
        try:
            # Clicar no menu de perfil
            profile_button = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "div[title='Profile']"))
            )
            profile_button.click()
            
            time.sleep(2)
            
            # Obter nome
            try:
                name_element = self.driver.find_element(By.CSS_SELECTOR, "div._3_7SH")
                name = name_element.text
            except:
                name = "Usuário"
            
            # Obter número (pode não estar visível)
            phone_number = "Não disponível"
            
            # Fechar menu
            close_button = self.driver.find_element(By.CSS_SELECTOR, "button[aria-label='Close']")
            close_button.click()
            
            return {
                "name": name,
                "phone_number": phone_number,
                "connected_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"✗ Erro ao obter dados do usuário: {e}")
            return {
                "name": "Usuário",
                "phone_number": "Não disponível",
                "connected_at": datetime.now().isoformat()
            }
    
    def save_session(self):
        """Salva dados da sessão"""
        try:
            session_data = {
                "is_authenticated": self.is_authenticated,
                "user_data": self.user_data,
                "saved_at": datetime.now().isoformat()
            }
            
            # Criptografar se cipher disponível
            if self.cipher:
                encrypted_data = self.cipher.encrypt(json.dumps(session_data).encode())
                with open(self.session_file, 'wb') as f:
                    f.write(encrypted_data)
            else:
                with open(self.session_file, 'w') as f:
                    json.dump(session_data, f)
            
            print("✓ Sessão salva com sucesso")
            return True
            
        except Exception as e:
            print(f"✗ Erro ao salvar sessão: {e}")
            return False
    
    def load_session(self):
        """Carrega sessão salva anteriormente"""
        try:
            if not os.path.exists(self.session_file):
                return False
            
            # Descriptografar se cipher disponível
            if self.cipher:
                with open(self.session_file, 'rb') as f:
                    encrypted_data = f.read()
                decrypted_data = self.cipher.decrypt(encrypted_data)
                session_data = json.loads(decrypted_data.decode())
            else:
                with open(self.session_file, 'r') as f:
                    session_data = json.load(f)
            
            self.is_authenticated = session_data.get("is_authenticated", False)
            self.user_data = session_data.get("user_data")
            
            print("✓ Sessão carregada com sucesso")
            return True
            
        except Exception as e:
            print(f"✗ Erro ao carregar sessão: {e}")
            return False
    
    def send_message(self, phone_number, message):
        """Envia mensagem para um número específico"""
        try:
            if not self.is_authenticated:
                raise Exception("Não autenticado")
            
            # Limpar número de telefone
            clean_phone = ''.join(filter(str.isdigit, phone_number))
            
            # Adicionar código do país se não tiver
            if not clean_phone.startswith('55'):
                clean_phone = '55' + clean_phone
            
            # Navegar para conversa
            url = f"https://web.whatsapp.com/send?phone={clean_phone}"
            self.driver.get(url)
            
            # Aguardar campo de mensagem
            wait = WebDriverWait(self.driver, 30)
            message_box = wait.until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "div[contenteditable='true'][data-tab='10']"))
            )
            
            # Digitar mensagem (linha por linha para preservar quebras)
            lines = message.split('\n')
            for i, line in enumerate(lines):
                message_box.send_keys(line)
                if i < len(lines) - 1:
                    # Shift+Enter para quebra de linha
                    from selenium.webdriver.common.keys import Keys
                    message_box.send_keys(Keys.SHIFT, Keys.ENTER)
            
            time.sleep(1)
            
            # Clicar no botão de enviar
            send_button = wait.until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "button[aria-label='Send']"))
            )
            send_button.click()
            
            # Aguardar confirmação de envio (ícone de check)
            time.sleep(2)
            
            print(f"✓ Mensagem enviada para {phone_number}")
            return True
            
        except Exception as e:
            print(f"✗ Erro ao enviar mensagem: {e}")
            return False
    
    def check_connection_status(self):
        """Verifica se a conexão está ativa"""
        try:
            if not self.driver:
                return {
                    "connected": False,
                    "message": "Driver não inicializado"
                }
            
            # Verificar se está na página do WhatsApp
            if "web.whatsapp.com" not in self.driver.current_url:
                self.driver.get("https://web.whatsapp.com")
                time.sleep(2)
            
            # Verificar autenticação
            is_auth = self.check_if_authenticated()
            
            if is_auth:
                return {
                    "connected": True,
                    "user_data": self.user_data,
                    "message": "Conectado"
                }
            else:
                return {
                    "connected": False,
                    "message": "Não autenticado"
                }
                
        except Exception as e:
            return {
                "connected": False,
                "message": f"Erro: {str(e)}"
            }
    
    def disconnect(self):
        """Desconecta e limpa dados"""
        try:
            if self.driver:
                # Fazer logout do WhatsApp Web
                try:
                    self.driver.get("https://web.whatsapp.com")
                    time.sleep(2)
                    
                    # Clicar no menu
                    menu_button = WebDriverWait(self.driver, 10).until(
                        EC.element_to_be_clickable((By.CSS_SELECTOR, "div[title='Menu']"))
                    )
                    menu_button.click()
                    
                    time.sleep(1)
                    
                    # Clicar em "Log out"
                    logout_button = self.driver.find_element(By.XPATH, "//div[text()='Log out']")
                    logout_button.click()
                    
                    time.sleep(2)
                except:
                    pass
                
                # Fechar navegador
                self.driver.quit()
                self.driver = None
            
            # Limpar arquivo de sessão
            if os.path.exists(self.session_file):
                os.remove(self.session_file)
            
            self.is_authenticated = False
            self.user_data = None
            
            print("✓ Desconectado com sucesso")
            return True
            
        except Exception as e:
            print(f"✗ Erro ao desconectar: {e}")
            return False
    
    def __del__(self):
        """Destrutor - fecha o driver se ainda estiver aberto"""
        if self.driver:
            try:
                self.driver.quit()
            except:
                pass
