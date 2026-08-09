import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


const loading = document.getElementById("courseLoading");
const content = document.getElementById("courseContent");

const title = document.getElementById("courseTitle");
const description = document.getElementById("courseDescription");
const category = document.getElementById("courseCategory");
const level = document.getElementById("courseLevel");
const lessonCount = document.getElementById("lessonCount");
const lessonsList = document.getElementById("lessonsList");

const params = new URLSearchParams(window.location.search);
const courseId = params.get("id");


async function loadCourse() {

    if (!courseId) {
        showError("No course ID was provided.");
        return;
    }

    try {

        const courseRef = doc(
            db,
            "courses",
            courseId
        );

        const courseSnap =
            await getDoc(courseRef);


        if (!courseSnap.exists()) {
            showError("Course not found.");
            return;
        }


        const course = courseSnap.data();


        title.textContent =
            course.title || "Untitled Course";

        description.textContent =
            course.description || "";

        category.textContent =
            course.category || "General";

        level.textContent =
            course.level || "Beginner";


        await loadLessons(courseId);


        loading.style.display = "none";
        content.style.display = "block";


    } catch (error) {

        console.error(
            "COURSE ERROR:",
            error
        );

        showError(
            "Error loading course: " +
            error.message
        );
    }
}


async function loadLessons(courseId) {

    const lessonsRef = collection(
        db,
        "courses",
        courseId,
        "lessons"
    );


    const snapshot =
        await getDocs(lessonsRef);


    console.log(
        "LESSONS FOUND:",
        snapshot.size
    );


    lessonsList.innerHTML = "";


    lessonCount.textContent =
        `${snapshot.size} Lessons`;


    if (snapshot.empty) {

        lessonsList.innerHTML = `
            <div class="loading-card">
                No lessons found in this course.
            </div>
        `;

        return;
    }


    const lessons =
        snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));


    lessons.sort(
        (a, b) =>
            Number(a.order || 999) -
            Number(b.order || 999)
    );


    lessons.forEach(
        (lesson, index) => {

            const card =
                document.createElement("div");

            card.className =
                "course-card";

            card.innerHTML = `

                <h3>
                    ${index + 1}.
                    ${escapeHTML(
                        lesson.title ||
                        "Untitled Lesson"
                    )}
                </h3>

                <p>
                    ${escapeHTML(
                        lesson.description ||
                        ""
                    )}
                </p>

                <br>

                <a
                    href="lesson.html?course=${encodeURIComponent(courseId)}&lesson=${encodeURIComponent(lesson.id)}"
                    class="btn btn-primary">

                    Start Lesson →

                </a>
            `;


            lessonsList.appendChild(card);

        }
    );
}


function showError(message) {

    loading.innerHTML = `
        <h2>
            ${escapeHTML(message)}
        </h2>

        <br>

        <a
            href="courses.html"
            class="btn btn-primary">

            ← Back to Courses

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


loadCourse();
