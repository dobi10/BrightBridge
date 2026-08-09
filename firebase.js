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
        "AIzaSyAu8vCNwhZ8irI2Knm7Ssc7Vku2f9XCFtc",

    authDomain:
        "brightbridge-0.firebaseapp.com",

    projectId:
        "brightbridge-0",

    storageBucket:
        "brightbridge-0.firebasestorage.app",

    messagingSenderId:
        "809001297248",

    appId:
        "1:809001297248:web:4f03dc77249b7781dcea05"

};


const app =
    initializeApp(firebaseConfig);


const auth =
    getAuth(app);


const db =
    getFirestore(app);


export {
    app,
    auth,
    db
};
