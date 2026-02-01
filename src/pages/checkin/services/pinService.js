import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import CryptoJS from 'crypto-js';
import { firestoreWithTimeout } from '../../../utils/timeoutWrapper';

const SECRET_KEY = 'torq-pin-secret-2024'; // Em produção, usar variável de ambiente

// Gerar PIN aleatório de 4 dígitos
export const generatePin = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Criptografar PIN
export const encryptPin = (pin) => {
  return CryptoJS.AES.encrypt(pin, SECRET_KEY).toString();
};

// Descriptografar PIN
export const decryptPin = (encryptedPin) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPin, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Salvar PIN no checkin
export const savePinToCheckin = async (checkinId, pin) => {
  try {
    const encryptedPin = encryptPin(pin);
    const checkinRef = doc(db, 'checkins', checkinId);
    
    await firestoreWithTimeout(
      () => updateDoc(checkinRef, {
        pin: encryptedPin,
        pinAttempts: 0,
        pinValidated: false,
        pinGeneratedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }),
      'Save PIN to checkin'
    );
    
    return { success: true, pin };
  } catch (error) {
    console.error('Error saving PIN:', error);
    return { success: false, error: error.message };
  }
};

// Validar PIN
export const validatePin = async (checkinId, inputPin) => {
  try {
    const checkinRef = doc(db, 'checkins', checkinId);
    const checkinSnap = await firestoreWithTimeout(
      () => getDoc(checkinRef),
      'Get checkin for PIN validation'
    );
    
    if (!checkinSnap.exists()) {
      return { success: false, error: 'Check-in não encontrado' };
    }
    
    const data = checkinSnap.data();
    const storedPin = decryptPin(data.pin);
    const attempts = data.pinAttempts || 0;
    
    // Verificar se excedeu tentativas
    if (attempts >= 3) {
      return { 
        success: false, 
        error: 'Número máximo de tentativas excedido. Contate o atendimento.',
        blocked: true 
      };
    }
    
    // Validar PIN
    if (inputPin === storedPin) {
      await firestoreWithTimeout(
        () => updateDoc(checkinRef, {
          pinValidated: true,
          pinValidatedAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }),
        'Update PIN validated'
      );
      
      return { success: true, message: 'PIN validado com sucesso!' };
    } else {
      // Incrementar tentativas
      await firestoreWithTimeout(
        () => updateDoc(checkinRef, {
          pinAttempts: attempts + 1,
          updatedAt: serverTimestamp()
        }),
        'Increment PIN attempts'
      );
      
      return { 
        success: false, 
        error: `PIN incorreto. ${2 - attempts} tentativa(s) restante(s)`,
        attemptsLeft: 2 - attempts
      };
    }
  } catch (error) {
    console.error('Error validating PIN:', error);
    return { success: false, error: 'Erro ao validar PIN. Tente novamente.' };
  }
};

// Resetar PIN (apenas admin)
export const resetPin = async (checkinId) => {
  try {
    const newPin = generatePin();
    const encryptedPin = encryptPin(newPin);
    const checkinRef = doc(db, 'checkins', checkinId);
    
    await firestoreWithTimeout(
      () => updateDoc(checkinRef, {
        pin: encryptedPin,
        pinAttempts: 0,
        pinValidated: false,
        pinResetAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }),
      'Reset PIN'
    );
    
    return { success: true, pin: newPin };
  } catch (error) {
    console.error('Error resetting PIN:', error);
    return { success: false, error: 'Erro ao resetar PIN. Tente novamente.' };
  }
};

// Verificar se PIN já foi validado
export const isPinValidated = async (checkinId) => {
  try {
    const checkinRef = doc(db, 'checkins', checkinId);
    const checkinSnap = await firestoreWithTimeout(
      () => getDoc(checkinRef),
      'Check PIN validation status'
    );
    
    if (!checkinSnap.exists()) {
      return false;
    }
    
    return checkinSnap.data().pinValidated || false;
  } catch (error) {
    console.error('Error checking PIN validation:', error);
    // 🔥 FAIL SAFE: Retornar false em caso de erro
    return false;
  }
};
