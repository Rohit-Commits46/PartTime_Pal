import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBNcT78iO1MbQrqUdGty0cFFZ-NRpFBvjc",
  authDomain: "pathtimepal.firebaseapp.com",
  projectId: "pathtimepal",
  storageBucket: "pathtimepal.firebasestorage.app",
  messagingSenderId: "1049866947638",
  appId: "1:1049866947638:web:1ff98a3f2210f7f3d09c97",
  measurementId: "G-RX97W5E8SE",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope('email');

export async function googleAuth() {
  try {
    const data = await signInWithPopup(auth, googleProvider);
    console.log("Google user:", data.user);
    return data.user;
  } catch (error) {
    console.error("Google Auth Error:", error);
    throw error;
  }
}

export async function facebookAuth() {
  try {
    const data = await signInWithPopup(auth, facebookProvider);
    console.log("Facebook user:", data.user);
    return data.user;
  } catch (error) {
    console.error("Facebook Auth Error:", error);
    throw error;
  }
}

export async function signOutUser() {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Sign Out Error:", error);
  }
}

