# Firebase Cloud Messaging (FCM)

## Status Atual
O Firebase Cloud Messaging está configurado mas **não inicializado automaticamente** para evitar erros em navegadores que não suportam a API.

## Por que não está inicializado?
- Alguns navegadores (especialmente em desenvolvimento local) não suportam Service Workers
- O ambiente de desenvolvimento pode não ter HTTPS configurado
- Evita erros no console que assustam os usuários

## Como usar (quando necessário)

### 1. Inicializar o Messaging

```javascript
import { initializeMessaging } from './config/firebase';

// Em um componente ou função async
const messaging = await initializeMessaging();

if (messaging) {
  // Messaging está disponível
  console.log('Firebase Messaging inicializado com sucesso');
} else {
  // Messaging não é suportado neste navegador
  console.warn('Firebase Messaging não está disponível');
}
```

### 2. Solicitar Permissão de Notificações

```javascript
import { getToken } from 'firebase/messaging';
import { initializeMessaging } from './config/firebase';

async function requestNotificationPermission() {
  try {
    const messaging = await initializeMessaging();
    
    if (!messaging) {
      console.warn('Messaging não suportado');
      return null;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'YOUR_VAPID_KEY_HERE'
      });
      
      console.log('Token FCM:', token);
      // Salvar token no Firestore para enviar notificações
      return token;
    }
  } catch (error) {
    console.error('Erro ao solicitar permissão:', error);
    return null;
  }
}
```

### 3. Receber Mensagens em Foreground

```javascript
import { onMessage } from 'firebase/messaging';
import { getMessagingInstance } from './config/firebase';

const messaging = getMessagingInstance();

if (messaging) {
  onMessage(messaging, (payload) => {
    console.log('Mensagem recebida:', payload);
    
    // Mostrar notificação customizada
    const { title, body } = payload.notification;
    new Notification(title, { body });
  });
}
```

## Requisitos para Produção

1. **HTTPS**: O site deve estar em HTTPS
2. **Service Worker**: Criar arquivo `public/firebase-messaging-sw.js`
3. **VAPID Key**: Gerar no Firebase Console > Project Settings > Cloud Messaging

### Exemplo de Service Worker

Criar arquivo `public/firebase-messaging-sw.js`:

```javascript
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Mensagem em background:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

## Testando Localmente

Para testar localmente com HTTPS:

```bash
# Usando Vite com HTTPS
npm run dev -- --https

# Ou configurar no vite.config.js
export default {
  server: {
    https: true
  }
}
```

## Referências

- [Firebase Cloud Messaging Docs](https://firebase.google.com/docs/cloud-messaging/js/client)
- [Web Push Notifications](https://web.dev/push-notifications-overview/)
