// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB_XRuyvQRFuajWF1gdMlSW6WiWMvOopnI",
    authDomain: "edubright-9380b.firebaseapp.com",
    projectId: "edubright-9380b",
    storageBucket: "edubright-9380b.firebasestorage.app",
    messagingSenderId: "934097927978",
    appId: "1:934097927978:web:744cac32d335598ff76853"
};


// Firebase SDK
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Firebase services
const auth = getAuth(app);
const db = getFirestore(app);


// Export services
export {
    app,
    auth,
    db
};
