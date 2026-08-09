import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


const userName =
    document.getElementById("userName");

const userLevel =
    document.getElementById("userLevel");

const userXP =
    document.getElementById("userXP");

const completedLessons =
    document.getElementById(
        "completedLessons"
    );

const certificateCount =
    document.getElementById(
        "certificateCount"
    );

const progressBar =
    document.getElementById(
        "progressBar"
    );

const progressText =
    document.getElementById(
        "progressText"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href =
            "login.html";

        return;
    }


    try {

        const userRef =
            doc(
                db,
                "users",
                user.uid
            );


        const userSnapshot =
            await getDoc(userRef);


        if (!userSnapshot.exists()) {

            console.error(
                "User profile not found."
            );

            return;
        }


        const data =
            userSnapshot.data();


        userName.textContent =
            data.name ||
            user.displayName ||
            "Student";


        const xp =
            Number(data.xp || 0);

        const level =
            Number(data.level || 1);


        const lessons =
            Array.isArray(
                data.completedLessons
            )
                ? data.completedLessons
                : [];


        const certificates =
            Array.isArray(
                data.certificates
            )
                ? data.certificates
                : [];


        userXP.textContent =
            xp;


        userLevel.textContent =
            level;


        completedLessons.textContent =
            lessons.length;


        certificateCount.textContent =
            certificates.length;


        /*
         * Each level contains 100 XP.
         */

        const progress =
            Math.min(
                xp % 100,
                100
            );


        progressBar.style.width =
            `${progress}%`;


        progressText.textContent =
            `${progress}% toward next level`;


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }

});


logoutBtn.addEventListener(
    "click",
    async () => {

        try {

            await signOut(auth);

            localStorage.removeItem(
                "userID"
            );

            window.location.href =
                "index.html";

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

    }
);
