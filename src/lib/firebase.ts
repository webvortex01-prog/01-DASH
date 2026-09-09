import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "blissful-fabric-v9brs",
  appId: "1:314673019253:web:ebe0e77532d299bef3bb3c",
  apiKey: "AIzaSyD1jtLzYtZSy5ct6BtZilohSk5lIAtTiU0",
  authDomain: "blissful-fabric-v9brs.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-zikaboardgesto-d7655a1a-a21f-4e7b-a08a-95153a9313f5",
  storageBucket: "blissful-fabric-v9brs.firebasestorage.app",
  messagingSenderId: "314673019253",
  measurementId: "",
  oAuthClientId: "314673019253-ttouqpliemqgp1dmebbe54k8vfj056mj.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

let app: any;
let auth: any;
let db: any;

export async function initFirebase() {
  if (app) return { app, auth, db };
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    return { app, auth, db };
  } catch (e) {
    console.error("Failed to load Firebase config", e);
    throw e;
  }
}
