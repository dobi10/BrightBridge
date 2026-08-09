import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    updateProfile,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


const form =
    document.getElementById("settingsForm");

const nameInput =
    document.getElementById("name");

const emailInput =
    document.getElementById("email");

const saveBtn =
    document.getElementById("saveBtn");

const message =
    document.getElementById("settingsMessage");

const logoutBtn =
    document.getElementById("logoutBtn");


onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href =
            "login.html";

        return;
    }


    emailInput.value =
        user.email || "";


    try {

        const userRef =
            doc(
                db,
                "users",
                user.uid
            );

        const snapshot =
            await getDoc(userRef);


        if (snapshot.exists()) {

            const data =
                snapshot.data();

            nameInput.value =
                data.name ||
                user.displayName ||
                "";

        } else {

            nameInput.value =
                user.displayName ||
                "";

        }

    } catch (error) {

        console.error(error);

    }

});


form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const user =
            auth.currentUser;


        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        const name =
            nameInput.value.trim();


        if (name.length < 2) {

            message.textContent =
                "Please enter your name.";

            return;
        }


        saveBtn.disabled =
            true;

        saveBtn.textContent =
            "Saving...";


        try {

            await updateProfile(
                user,
                {
                    displayName: name
                }
            );


            await updateDoc(
                doc(
                    db,
                    "users",
                    user.uid
                ),
                {
                    name: name
                }
            );


            message.textContent =
                "Profile updated successfully! ✓";


            message.style.color =
                "#16a34a";


        } catch (error) {

            console.error(error);


            message.textContent =
                "Could not update your profile.";


            message.style.color =
                "#dc2626";

        }


        saveBtn.disabled =
            false;

        saveBtn.textContent =
            "Save Changes";

    }
);


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
