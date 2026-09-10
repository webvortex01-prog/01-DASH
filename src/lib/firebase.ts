import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAvwUbsy6E4vZRho1PRDqfU0Ixc1daMCkQ",
  authDomain: "zikaboard-12697.firebaseapp.com",
  projectId: "zikaboard-12697",
  storageBucket: "zikaboard-12697.firebasestorage.app",
  messagingSenderId: "625769604144",
  appId: "1:625769604144:web:f468904f2536a93cab39f5"
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
