import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


const loading =
    document.getElementById("courseLoading");

const content =
    document.getElementById("courseContent");

const title =
    document.getElementById("courseTitle");

const description =
    document.getElementById("courseDescription");

const category =
    document.getElementById("courseCategory");

const level =
    document.getElementById("courseLevel");

const lessonCount =
    document.getElementById("lessonCount");

const lessonsList =
    document.getElementById("lessonsList");


const params =
    new URLSearchParams(
        window.location.search
    );

const courseId =
    params.get("id");


async function loadCourse() {

    if (!courseId) {
        showError("No course was selected.");
        return;
    }

    try {

        const courseRef =
            doc(db, "courses", courseId);

        const courseSnapshot =
            await getDoc(courseRef);

        if (!courseSnapshot.exists()) {
            showError("Course not found.");
            return;
        }

        const course =
            courseSnapshot.data();

        title.textContent =
            course.title || "Untitled Course";

        description.textContent =
            course.description ||
            "No description available.";

        category.textContent =
            course.category || "General";

        level.textContent =
            course.level || "Beginner";

        await loadLessons();

        await loadQuizzes();

        loading.style.display = "none";
        content.style.display = "block";

        document.title =
            `${course.title || "Course"} | EduBright`;

    } catch (error) {

        console.error(error);

        showError(
            "Unable to load this course."
        );
    }
}


async function loadLessons() {

    lessonsList.innerHTML = `
        <div class="loading-card">
            Loading lessons...
        </div>
    `;

    try {

        const lessonsRef =
            collection(
                db,
                "courses",
                courseId,
                "lessons"
            );

        let snapshot;

        try {

            const orderedQuery =
                query(
                    lessonsRef,
                    orderBy("order", "asc")
                );

            snapshot =
                await getDocs(orderedQuery);

        } catch {

            snapshot =
                await getDocs(lessonsRef);
        }

        lessonCount.textContent =
            `${snapshot.size} Lessons`;

        lessonsList.innerHTML = "";

        if (snapshot.empty) {

            lessonsList.innerHTML = `
                <div class="loading-card">
                    No lessons available yet.
                </div>
            `;

            return;
        }

        snapshot.docs.forEach(
            (lessonDoc, index) => {

                const lesson =
                    lessonDoc.data();

                const item =
                    document.createElement("div");

                item.className =
                    "course-card";

                item.style.marginBottom =
                    "12px";

                item.innerHTML = `

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
                            "Start this lesson."
                        )}
                    </p>

                    <br>

                    <a
                        class="btn btn-primary"
                        href="lesson.html?course=${encodeURIComponent(
                            courseId
                        )}&lesson=${encodeURIComponent(
                            lessonDoc.id
                        )}">

                        Start Lesson →

                    </a>
                `;

                lessonsList.appendChild(item);
            }
        );

    } catch (error) {

        console.error(error);

        lessonsList.innerHTML = `
            <div class="loading-card">
                Could not load lessons.
            </div>
        `;
    }
}


async function loadQuizzes() {

    try {

        const quizzesRef =
            collection(
                db,
                "courses",
                courseId,
                "quizzes"
            );

        const snapshot =
            await getDocs(quizzesRef);

        if (snapshot.empty) {
            return;
        }

        const quizSection =
            document.createElement("section");

        quizSection.style.marginTop =
            "40px";

        quizSection.innerHTML = `
            <h2>
                Course Quizzes
            </h2>
        `;

        snapshot.docs.forEach(
            (quizDoc) => {

                const quiz =
                    quizDoc.data();

                const card =
                    document.createElement("div");

                card.className =
                    "course-card";

                card.style.marginTop =
                    "15px";

                card.innerHTML = `

                    <h3>
                        ${escapeHTML(
                            quiz.title ||
                            "Quiz"
                        )}
                    </h3>

                    <p>
                        Test what you've learned.
                    </p>

                    <br>

                    <a
                        href="quiz.html?course=${encodeURIComponent(
                            courseId
                        )}&quiz=${encodeURIComponent(
                            quizDoc.id
                        )}"
                        class="btn btn-primary">

                        Take Quiz →

                    </a>
                `;

                quizSection.appendChild(card);
            }
        );

        content.appendChild(quizSection);

    } catch (error) {

        console.error(
            "Quiz loading error:",
            error
        );
    }
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
