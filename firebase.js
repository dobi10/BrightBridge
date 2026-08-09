import { initializeApp } from "firebase/app";

import {
    getAuth
} from "firebase/auth";

import {
    getFirestore
} from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyAu8vCNwhZ8irI2Knm7Ssc7Vku2f9XCFtc",
    authDomain: "brightbridge-0.firebaseapp.com",
    projectId: "brightbridge-0",
    storageBucket: "brightbridge-0.firebasestorage.app",
    messagingSenderId: "809001297248",
    appId: "1:809001297248:web:4b23e504ef9826bcdcea05"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


export {
    app,
    auth,
    db
};
