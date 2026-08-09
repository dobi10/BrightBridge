import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    updateProfile,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc
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


let currentUser = null;


onAuthStateChanged(auth, async (user) => {

    if (!user) {

        window.location.href =
            "login.html";

        return;
    }


    currentUser = user;

    emailInput.value =
        user.email || "";


    try {

        const userRef =
            doc(db, "users", user.uid);

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
                user.email?.split("@")[0] ||
                "";

        }

    } catch (error) {

        console.error(
            "Settings load error:",
            error
        );

    }

});


form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!currentUser) {
            return;
        }


        const name =
            nameInput.value.trim();


        if (name.length < 2) {

            message.textContent =
                "Please enter at least 2 characters.";

            return;
        }


        saveBtn.disabled = true;

        saveBtn.textContent =
            "Saving...";


        try {

            await updateProfile(
                currentUser,
                {
                    displayName: name
                }
            );


            await setDoc(
                doc(
                    db,
                    "users",
                    currentUser.uid
                ),
                {
                    uid: currentUser.uid,
                    name: name,
                    email:
                        currentUser.email || ""
                },
                {
                    merge: true
                }
            );


            message.textContent =
                "Profile saved successfully ✓";

            message.style.color =
                "green";


        } catch (error) {

            console.error(
                "SETTINGS ERROR:",
                error
            );


            message.textContent =
                error.message;

            message.style.color =
                "red";

        }


        saveBtn.disabled = false;

        saveBtn.textContent =
            "Save Changes";

    }
);


logoutBtn.addEventListener(
    "click",
    async () => {

        await signOut(auth);

        window.location.href =
            "index.html";

    }
);
