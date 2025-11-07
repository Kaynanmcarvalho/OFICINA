"""
Flask API para automação WhatsApp
Fornece endpoints REST e WebSocket para comunicação com frontend
"""

import os
import threading
from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
from dotenv import load_dotenv
from whatsapp_service import WhatsAppService

# Carregar variáveis de ambiente
load_dotenv()

# Inicializar Flask
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SESSION_ENCRYPTION_KEY', 'dev-secret-key')

# Configurar CORS - Permitir todas as origens em desenvolvimento
cors_origins = os.getenv('CORS_ORIGINS', '*')
if cors_origins != '*':
    cors_origins = cors_origins.split(',')

CORS(app, resources={
    r"/*": {
        "origins": cors_origins,
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": False,
        "expose_headers": ["Content-Type"]
    }
})

# Inicializar SocketIO
socketio = SocketIO(app, cors_allowed_origins=cors_origins, async_mode='threading')

# Instância global do WhatsAppService
whatsapp_service = None
connection_lock = threading.Lock()


def get_whatsapp_service():
    """Obtém ou cria instância do WhatsAppService"""
    global whatsapp_service
    
    with connection_lock:
        if whatsapp_service is None:
            profile_dir = os.getenv('WHATSAPP_PROFILE_DIR', './whatsapp_profile')
            encryption_key = os.getenv('SESSION_ENCRYPTION_KEY')
            whatsapp_service = WhatsAppService(profile_dir, encryption_key)
            
            # Tentar carregar sessão existente
            whatsapp_service.load_session()
            
            # Inicializar driver se houver sessão
            if whatsapp_service.is_authenticated:
                whatsapp_service.initialize_driver()
        
        return whatsapp_service


# ============================================================================
# REST API ENDPOINTS
# ============================================================================

@app.route('/api/whatsapp/connect', methods=['POST'])
def connect_whatsapp():
    """Inicia processo de conexão e retorna QR Code"""
    try:
        print("→ Recebida requisição de conexão")
        
        service = get_whatsapp_service()
        
        # Se já está autenticado, retornar status
        if service.is_authenticated and service.driver:
            print("✓ Já autenticado")
            return jsonify({
                'status': 'already_authenticated',
                'user_data': service.user_data
            }), 200
        
        # Inicializar driver se necessário
        if not service.driver:
            print("→ Inicializando driver...")
            service.initialize_driver()
        
        # Obter QR Code
        print("→ Obtendo QR Code...")
        qr_code = service.get_qr_code(timeout=20)
        
        if qr_code:
            print("✓ QR Code obtido com sucesso")
            
            # Iniciar thread para aguardar autenticação
            def wait_auth():
                def on_authenticated(user_data):
                    # Emitir evento de sucesso via WebSocket
                    socketio.emit('authentication_success', user_data, namespace='/whatsapp')
                
                service.wait_for_authentication(timeout=60, callback=on_authenticated)
            
            auth_thread = threading.Thread(target=wait_auth, daemon=True)
            auth_thread.start()
            
            return jsonify({
                'status': 'waiting_qr',
                'qr_code': qr_code
            }), 200
        else:
            # Verificar se realmente está autenticado
            if service.check_if_authenticated():
                print("✓ Já autenticado (sem QR Code)")
                return jsonify({
                    'status': 'already_authenticated',
                    'user_data': service.user_data
                }), 200
            else:
                # Erro ao obter QR Code
                raise Exception("Não foi possível obter QR Code e não está autenticado")
            
    except Exception as e:
        print(f"✗ Erro ao conectar: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            'error': str(e),
            'message': 'Erro ao iniciar conexão'
        }), 500


@app.route('/api/whatsapp/status', methods=['GET'])
def get_status():
    """Verifica status da conexão"""
    try:
        service = get_whatsapp_service()
        
        if not service.driver:
            return jsonify({
                'connected': False,
                'message': 'Driver não inicializado'
            }), 200
        
        status = service.check_connection_status()
        return jsonify(status), 200
        
    except Exception as e:
        return jsonify({
            'connected': False,
            'error': str(e)
        }), 500


@app.route('/api/whatsapp/send', methods=['POST'])
def send_message():
    """Envia mensagem via WhatsApp"""
    try:
        data = request.get_json()
        
        phone_number = data.get('phone_number')
        message = data.get('message')
        budget_id = data.get('budget_id')
        
        if not phone_number or not message:
            return jsonify({
                'error': 'phone_number e message são obrigatórios'
            }), 400
        
        service = get_whatsapp_service()
        
        if not service.is_authenticated:
            return jsonify({
                'error': 'NOT_CONNECTED',
                'message': 'WhatsApp não está conectado'
            }), 401
        
        # Emitir progresso via WebSocket
        socketio.emit('send_progress', {
            'budget_id': budget_id,
            'status': 'sending',
            'progress': 50
        }, namespace='/whatsapp')
        
        # Enviar mensagem
        success = service.send_message(phone_number, message)
        
        if success:
            # Emitir sucesso
            socketio.emit('send_success', {
                'budget_id': budget_id
            }, namespace='/whatsapp')
            
            return jsonify({
                'success': True,
                'message': 'Mensagem enviada com sucesso'
            }), 200
        else:
            # Emitir erro
            socketio.emit('send_error', {
                'budget_id': budget_id,
                'error': 'Falha ao enviar'
            }, namespace='/whatsapp')
            
            return jsonify({
                'error': 'SEND_FAILED',
                'message': 'Falha ao enviar mensagem'
            }), 500
            
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Erro ao enviar mensagem'
        }), 500


@app.route('/api/whatsapp/disconnect', methods=['POST'])
def disconnect_whatsapp():
    """Desconecta sessão do WhatsApp"""
    try:
        global whatsapp_service
        
        if whatsapp_service:
            whatsapp_service.disconnect()
            whatsapp_service = None
        
        return jsonify({
            'success': True,
            'message': 'Desconectado com sucesso'
        }), 200
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Erro ao desconectar'
        }), 500


# ============================================================================
# WEBSOCKET EVENTS
# ============================================================================

@socketio.on('connect', namespace='/whatsapp')
def handle_connect():
    """Cliente conectou ao WebSocket"""
    print('Cliente conectado ao WebSocket')
    emit('connected', {'message': 'Conectado ao servidor WhatsApp'})


@socketio.on('disconnect', namespace='/whatsapp')
def handle_disconnect():
    """Cliente desconectou do WebSocket"""
    print('Cliente desconectado do WebSocket')


@socketio.on('request_qr', namespace='/whatsapp')
def handle_request_qr():
    """Cliente solicitou novo QR Code"""
    try:
        service = get_whatsapp_service()
        qr_code = service.get_qr_code()
        
        if qr_code:
            emit('qr_code_updated', {'qr_code': qr_code})
        else:
            emit('already_authenticated', {'user_data': service.user_data})
            
    except Exception as e:
        emit('error', {'message': str(e)})


# ============================================================================
# HEALTH CHECK
# ============================================================================

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'whatsapp-automation'
    }), 200


# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    print(f"""
    ╔══════════════════════════════════════════════════════════╗
    ║  WhatsApp Automation API                                 ║
    ║  Servidor iniciado em http://localhost:{port}            ║
    ║  WebSocket disponível em ws://localhost:{port}/whatsapp  ║
    ╚══════════════════════════════════════════════════════════╝
    """)
    
    socketio.run(app, host='0.0.0.0', port=port, debug=debug, allow_unsafe_werkzeug=True)
