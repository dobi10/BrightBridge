import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";


const form =
    document.getElementById("loginForm");

const loginButton =
    document.getElementById("loginBtn");

const message =
    document.getElementById("loginMessage");


form.addEventListener("submit", async (event) => {

    event.preventDefault();


    const email =
        document.getElementById("email")
            .value
            .trim();

    const password =
        document.getElementById("password")
            .value;


    message.textContent = "";


    loginButton.disabled = true;

    loginButton.textContent =
        "Logging in...";


    try {

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


        const user =
            userCredential.user;


        localStorage.setItem(
            "userID",
            user.uid
        );


        message.textContent =
            "Login successful!";


        window.location.href =
            "dashboard.html";


    } catch (error) {

        console.error(error);


        let errorMessage =
            "Login failed. Please try again.";


        if (
            error.code ===
            "auth/invalid-credential"
        ) {

            errorMessage =
                "Incorrect email or password.";

        }

        else if (
            error.code ===
            "auth/user-not-found"
        ) {

            errorMessage =
                "No account exists with this email.";

        }

        else if (
            error.code ===
            "auth/wrong-password"
        ) {

            errorMessage =
                "Incorrect password.";

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
            "auth/too-many-requests"
        ) {

            errorMessage =
                "Too many attempts. Try again later.";

        }


        message.textContent =
            errorMessage;


        loginButton.disabled = false;

        loginButton.textContent =
            "Login";

    }

});
