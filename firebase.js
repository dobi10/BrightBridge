import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


const firebaseConfig = {

    apiKey:
        "AIzaSyB_XRuyvQRFuajWF1gdMlSW6WiWMvOopnI",

    authDomain:
        "edubright-9380b.firebaseapp.com",

    projectId:
        "edubright-9380b",

    storageBucket:
        "edubright-9380b.firebasestorage.app",

    messagingSenderId:
        "934097927978",

    appId:
        "1:934097927978:web:744cac32d335598ff76853"

};


const app =
    initializeApp(
        firebaseConfig
    );


const auth =
    getAuth(app);


const db =
    getFirestore(app);


export {
    app,
    auth,
    db
};
