import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyA9HZI_RHaVHBO9U42YT8fdCUPUwX4tzEA",
    authDomain: "crm-basico.firebaseapp.com",
    projectId: "crm-basico",
    storageBucket: "crm-basico.appspot.com",
    messagingSenderId: "525428812842",
    appId: "1:525428812842:web:91e90e2f39aba807bb2753"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, getDoc, query, where, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, onAuthStateChanged, signOut, googleProvider };
