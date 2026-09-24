// Importando as funções do SDK Modular (V9+)
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuração puxando das variáveis de ambiente protegidas
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Padrão Singleton: Inicializa o Firebase apenas se ele ainda não estiver rodando.
// Isso evita erros de "App already exists" no Next.js durante o desenvolvimento.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exportando a instância do Firestore para usarmos em todo o app
const db = getFirestore(app);

export { app, db };