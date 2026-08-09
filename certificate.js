import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


const certificateList =
    document.getElementById(
        "certificateList"
    );


onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        await loadCertificates(user.uid);

    }
);


async function loadCertificates(uid) {

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

            showEmpty();

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


        certificateList.innerHTML =
            "";


        if (certificates.length === 0) {

            showEmpty();

            return;
        }


        certificates.forEach(
            (certificate) => {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "course-card";


                card.innerHTML = `

                    <div
                        class="feature-icon">

                        🏆

                    </div>

                    <h3>
                        ${escapeHTML(
                            certificate.title ||
                            "EduBright Certificate"
                        )}
                    </h3>

                    <p>
                        Awarded to
                        <strong>
                            ${escapeHTML(
                                data.name ||
                                userNameFallback()
                            )}
                        </strong>
                    </p>

                    <p>
                        Certificate ID:
                        ${escapeHTML(
                            certificate.id ||
                            "N/A"
                        )}
                    </p>

                    <p>
                        ${escapeHTML(
                            certificate.date ||
                            ""
                        )}
                    </p>

                    <br>

                    <button
                        class="btn btn-primary"
                        data-id="${escapeHTML(
                            certificate.id ||
                            ""
                        )}">

                        View Certificate

                    </button>

                `;


                certificateList.appendChild(
                    card
                );

            }
        );


        document
            .querySelectorAll(
                "[data-id]"
            )
            .forEach(
                (button) => {

                    button.addEventListener(
                        "click",
                        () => {

                            const id =
                                button.dataset.id;

                            window.location.href =
                                `certificate-view.html?id=${encodeURIComponent(
                                    id
                                )}`;

                        }
                    );

                }
            );


    } catch (error) {

        console.error(
            "Certificate error:",
            error
        );


        certificateList.innerHTML = `

            <div class="loading-card">

                Could not load certificates.

            </div>

        `;

    }

}


function showEmpty() {

    certificateList.innerHTML = `

        <div class="loading-card">

            <div
                class="feature-icon">
                🏆
            </div>

            <h2>
                No certificates yet
            </h2>

            <p>
                Complete courses and quizzes
                to earn certificates.
            </p>

            <br>

            <a
                href="courses.html"
                class="btn btn-primary">

                Browse Courses

            </a>

        </div>

    `;

}


function userNameFallback() {

    return "Student";

}


function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}
