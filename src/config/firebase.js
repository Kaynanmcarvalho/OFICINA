// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getMessaging, isSupported } from 'firebase/messaging';

// Your web app's Firebase configuration
// For Firebase JS SDK v9-compat and later, measurementId is optional

  // TODO: Add your Firebase config here
  // You can get this from your Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCMhYAH03gzL0H705XjSBp8-4gxhmE246Q",
  authDomain: "oficina-reparofacil.firebaseapp.com",
  projectId: "oficina-reparofacil",
  storageBucket: "oficina-reparofacil.firebasestorage.app",
  messagingSenderId: "610352587990",
  appId: "1:610352587990:web:dc0add122ccb7f54c09577",
  measurementId: "G-YGV44MV8G3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = isSupported() ? getMessaging(app) : null;

export default app;