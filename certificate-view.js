import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


const loading =
    document.getElementById(
        "certificateLoading"
    );

const certificate =
    document.getElementById(
        "certificate"
    );

const certificateName =
    document.getElementById(
        "certificateName"
    );

const certificateCourse =
    document.getElementById(
        "certificateCourse"
    );

const certificateDate =
    document.getElementById(
        "certificateDate"
    );

const certificateId =
    document.getElementById(
        "certificateId"
    );

const printButton =
    document.getElementById(
        "printBtn"
    );


const params =
    new URLSearchParams(
        window.location.search
    );

const certificateID =
    params.get("id");


onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        await loadCertificate(user.uid);

    }
);


async function loadCertificate(uid) {

    if (!certificateID) {

        showError(
            "Certificate ID is missing."
        );

        return;
    }


    try {

        const userRef =
            doc(
                db,
                "users",
                uid
            );


        const snapshot =
            await getDoc(userRef);


        if (!snapshot.exists()) {

            showError(
                "User profile not found."
            );

            return;
        }


        const data =
            snapshot.data();


        const certificates =
            Array.isArray(
                data.certificates
            )
                ? data.certificates
                : [];


        const found =
            certificates.find(
                (item) =>
                    String(
                        item.id
                    ) ===
                    String(
                        certificateID
                    )
            );


        if (!found) {

            showError(
                "Certificate not found."
            );

            return;
        }


        certificateName.textContent =
            data.name ||
            "Student";


        certificateCourse.textContent =
            found.title ||
            "Course Completion";


        certificateDate.textContent =
            found.date ||
            "";


        certificateId.textContent =
            `Certificate ID: ${
                found.id
            }`;


        loading.style.display =
            "none";

        certificate.style.display =
            "block";


        document.title =
            `${found.title || "Certificate"} | EduBright`;


    } catch (error) {

        console.error(
            "Certificate viewer error:",
            error
        );


        showError(
            "Could not load certificate."
        );

    }

}


printButton.addEventListener(
    "click",
    () => {

        window.print();

    }
);


function showError(message) {

    loading.innerHTML = `

        <h2>
            ${escapeHTML(message)}
        </h2>

        <br>

        <a
            href="certificate.html"
            class="btn btn-primary">

            ← Back to Certificates

        </a>

    `;

}


function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

              }
