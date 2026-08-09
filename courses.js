import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


const coursesGrid =
    document.getElementById("coursesGrid");

const searchInput =
    document.getElementById("courseSearch");

const categoryButtons =
    document.querySelectorAll(
        ".category-btn"
    );


let courses = [];

let selectedCategory = "all";


async function loadCourses() {

    coursesGrid.innerHTML = `
        <div class="loading-card">
            Loading courses...
        </div>
    `;


    try {

        const snapshot =
            await getDocs(
                collection(db, "courses")
            );


        courses = snapshot.docs.map(
            (courseDoc) => ({

                id: courseDoc.id,

                ...courseDoc.data()

            })
        );


        renderCourses();


    } catch (error) {

        console.error(
            "Courses error:",
            error
        );


        coursesGrid.innerHTML = `
            <div class="loading-card">

                <p>
                    Could not load courses.
                </p>

                <button
                    id="retryCourses"
                    class="btn btn-primary">

                    Try Again

                </button>

            </div>
        `;


        document
            .getElementById("retryCourses")
            .addEventListener(
                "click",
                loadCourses
            );

    }

}


function renderCourses() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const filtered =
        courses.filter((course) => {

            const title =
                String(
                    course.title || ""
                ).toLowerCase();


            const description =
                String(
                    course.description || ""
                ).toLowerCase();


            const category =
                String(
                    course.category || ""
                ).toLowerCase();


            const matchesSearch =
                !search ||
                title.includes(search) ||
                description.includes(search);


            const matchesCategory =
                selectedCategory === "all" ||
                category === selectedCategory;


            return (
                matchesSearch &&
                matchesCategory
            );

        });


    coursesGrid.innerHTML = "";


    if (filtered.length === 0) {

        coursesGrid.innerHTML = `
            <div class="loading-card">

                No courses found.

            </div>
        `;

        return;
    }


    filtered.forEach((course) => {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "course-card";


        card.innerHTML = `

            <div class="feature-icon">
                📚
            </div>

            <h3>
                ${escapeHTML(
                    course.title ||
                    "Untitled Course"
                )}
            </h3>

            <p>
                ${escapeHTML(
                    course.description ||
                    "Start learning today."
                )}
            </p>

            <div class="course-meta">

                <span class="tag">
                    ${escapeHTML(
                        course.category ||
                        "General"
                    )}
                </span>

                <span class="tag">
                    ${escapeHTML(
                        course.level ||
                        "Beginner"
                    )}
                </span>

            </div>

            <br>

            <a
                href="course.html?id=${encodeURIComponent(
                    course.id
                )}"
                class="btn btn-primary">

                View Course →

            </a>

        `;


        coursesGrid.appendChild(card);

    });

}


searchInput.addEventListener(
    "input",
    renderCourses
);


categoryButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                selectedCategory =
                    button.dataset.category;


                categoryButtons.forEach(
                    (btn) => {

                        btn.classList.remove(
                            "btn-primary"
                        );

                        btn.classList.add(
                            "btn-outline"
                        );

                    }
                );


                button.classList.remove(
                    "btn-outline"
                );

                button.classList.add(
                    "btn-primary"
                );


                renderCourses();

            }
        );

    }
);


function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


loadCourses();
