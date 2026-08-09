import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    limit
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


const featuredCourses =
    document.getElementById("featuredCourses");


async function loadFeaturedCourses() {

    try {

        const coursesQuery = query(
            collection(db, "courses"),
            limit(6)
        );

        const snapshot =
            await getDocs(coursesQuery);


        featuredCourses.innerHTML = "";


        if (snapshot.empty) {

            featuredCourses.innerHTML = `
                <div class="loading-card">
                    No courses available yet.
                </div>
            `;

            return;
        }


        snapshot.forEach((courseDoc) => {

            const course =
                courseDoc.data();


            const card =
                document.createElement("article");


            card.className =
                "course-card";


            card.innerHTML = `

                <div class="feature-icon">
                    📚
                </div>

                <h3>
                    ${escapeHTML(course.title || "Untitled Course")}
                </h3>

                <p>
                    ${escapeHTML(
                        course.description ||
                        "Start learning this course."
                    )}
                </p>

                <div class="course-meta">

                    <span class="tag">
                        ${escapeHTML(
                            course.level || "Beginner"
                        )}
                    </span>

                    <span class="tag">
                        ${escapeHTML(
                            course.category || "General"
                        )}
                    </span>

                </div>

                <br>

                <a
                    href="courses.html"
                    class="btn btn-primary">

                    Start Learning →

                </a>

            `;


            featuredCourses.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Could not load courses:",
            error
        );


        featuredCourses.innerHTML = `
            <div class="loading-card">
                <p>
                    Courses could not be loaded.
                </p>

                <button
                    class="btn btn-primary"
                    id="retryCourses">

                    Try Again

                </button>
            </div>
        `;


        const retry =
            document.getElementById(
                "retryCourses"
            );


        retry.addEventListener(
            "click",
            loadFeaturedCourses
        );

    }

}


/* Prevent Firebase content from becoming HTML */
function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


loadFeaturedCourses();
