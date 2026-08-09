import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    doc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


const form =
    document.getElementById("signupForm");

const signupButton =
    document.getElementById("signupBtn");

const message =
    document.getElementById("signupMessage");


form.addEventListener("submit", async (event) => {

    event.preventDefault();


    const name =
        document.getElementById("name")
            .value
            .trim();

    const email =
        document.getElementById("email")
            .value
            .trim();

    const password =
        document.getElementById("password")
            .value;

    const confirmPassword =
        document
            .getElementById("confirmPassword")
            .value;


    message.textContent = "";


    if (name.length < 2) {

        message.textContent =
            "Please enter your full name.";

        return;
    }


    if (password !== confirmPassword) {

        message.textContent =
            "Passwords do not match.";

        return;
    }


    signupButton.disabled = true;

    signupButton.textContent =
        "Creating account...";


    try {

        const credential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user =
            credential.user;


        await updateProfile(
            user,
            {
                displayName: name
            }
        );


        await setDoc(
            doc(db, "users", user.uid),
            {
                uid: user.uid,
                name: name,
                email: email,

                role: "student",

                xp: 0,
                level: 1,

                completedLessons: [],

                quizScores: [],

                badges: [],

                certificates: [],

                createdAt:
                    serverTimestamp()
            }
        );


        localStorage.setItem(
            "userID",
            user.uid
        );


        message.textContent =
            "Account created successfully!";


        window.location.href =
            "dashboard.html";


    } catch (error) {

        console.error(error);


        let errorMessage =
            "Could not create your account.";


        if (
            error.code ===
            "auth/email-already-in-use"
        ) {

            errorMessage =
                "An account already exists with this email.";

        }

        else if (
            error.code ===
            "auth/invalid-email"
        ) {

            errorMessage =
                "Please enter a valid email.";

        }

        else if (
            error.code ===
            "auth/weak-password"
        ) {

            errorMessage =
                "Password must be at least 6 characters.";

        }


        message.textContent =
            errorMessage;


        signupButton.disabled = false;

        signupButton.textContent =
            "Create Account";

    }

});
