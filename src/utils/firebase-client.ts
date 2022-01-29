import {initializeApp} from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCBYCBuGbZhk0MEDhTDdlVXvzFf587vZLk',
  authDomain: 'magic-events-gg.firebaseapp.com',
  projectId: 'magic-events-gg',
  storageBucket: 'magic-events-gg.appspot.com',
  messagingSenderId: '220407186011',
  appId: '1:220407186011:web:fa93105bc0a517d403357e',
};

const app = initializeApp(firebaseConfig);

export async function signUp(email: string, password: string) {
  const auth = getAuth();
  return await createUserWithEmailAndPassword(auth, email, password);
}

export async function login(email: string, password: string) {
  const auth = getAuth();
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  const auth = getAuth();
  return signOut(auth);
}

export function getUserProfile() {
  const auth = getAuth();
  return auth.currentUser;
}

export function addAuthStateListener(cb: (u: User | null) => void) {
  const auth = getAuth();
  return onAuthStateChanged(auth, cb);
}
