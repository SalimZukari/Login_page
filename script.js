// Firebase Imports and Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app-check.js";

const firebaseConfig = {
    apiKey: "AIzaSyAQMahWZQRBteiRXa_V-IrQYa76wGpEf5Y",
    authDomain: "login-4b453.firebaseapp.com",
    projectId: "login-4b453",
    storageBucket: "login-4b453.firebasestorage.app",
    messagingSenderId: "778554242149",
    appId: "1:778554242149:web:dfa89db828c776577d028c",
    measurementId: "G-WP4KPYT763"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let isRegistering = false;
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6Le9yuUqAAAAAP8vwv_-RJm3S45L_vNfNjAD4kga'), // Replace with your reCAPTCHA site key
    isTokenAutoRefreshEnabled: true, // Enable token auto-refresh
  });

// DOM Elements
const loginContainer = document.getElementById('login-container');
const registerContainer = document.getElementById('register-container');
const welcomePage = document.getElementById('welcome-page');
const userNameDisplay = document.getElementById('user-name');
const logoutButton = document.getElementById('logout-button');

// Utility Function to Toggle Visibility
const toggleVisibility = (showElement, ...hideElements) => {
    showElement.style.display = 'block';
    hideElements.forEach(element => element.style.display = 'none');
};

// Handle Registration

const handleRegister = async (event) => {
    event.preventDefault();
    const email = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    isRegistering = true; // Set flag to indicate registration is in progress

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), { username: email });
        alert('Registration successful! You can now log in.');
        await signOut(auth);

        toggleVisibility(loginContainer, registerContainer);
    } catch (error) {
        alert(error.message);
    } finally {
        isRegistering = false; // Reset the flag
    }
};


// Handle Login
const handleLogin = async (event) => {
    event.preventDefault();
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        userNameDisplay.textContent = user.email;
        toggleVisibility(welcomePage, loginContainer);
    } catch {
        alert('Invalid username or password.');
    }
};

// Handle Logout
const handleLogout = async () => {
    try {
        await signOut(auth);
        alert('You have been logged out.');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        toggleVisibility(loginContainer, welcomePage);
    } catch {
        alert('Error logging out.');
    }
};

// Listen to Auth State Changes
onAuthStateChanged(auth, (user) => {
    if (isRegistering) return; // Skip state change during registration
    if (user) {
        userNameDisplay.textContent = user.email;
        toggleVisibility(welcomePage, loginContainer);
    } else {
        toggleVisibility(loginContainer, welcomePage);
    }
});


// Attach Event Listeners Once DOM is Fully Loaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('register-link').addEventListener('click', () => toggleVisibility(registerContainer, loginContainer));
    document.getElementById('back-to-login').addEventListener('click', () => toggleVisibility(loginContainer, registerContainer));
    logoutButton.addEventListener('click', handleLogout);
});
