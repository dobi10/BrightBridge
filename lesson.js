import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

import {
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    increment
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


const loading =
    document.getElementById("lessonLoading");

const content =
    document.getElementById("lessonContent");

const title =
    document.getElementById("lessonTitle");

const description =
    document.getElementById("lessonDescription");

const lessonNumber =
    document.getElementById("lessonNumber");

const lessonText =
    document.getElementById("lessonText");

const codeSection =
    document.getElementById("codeSection");

const lessonCode =
    document.getElementById("lessonCode");

const copyCode =
    document.getElementById("copyCode");

const completeButton =
    document.getElementById("completeLessonBtn");

const message =
    document.getElementById("lessonMessage");

const backToCourse =
    document.getElementById("backToCourse");


const params =
    new URLSearchParams(
        window.location.search
    );

const courseId =
    params.get("course");

const lessonId =
    params.get("lesson");


let currentUser = null;


/* -------------------------
   Authentication
------------------------- */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }

        currentUser = user;

        await loadLesson();
    }
);


/* -------------------------
   Load lesson
------------------------- */

async function loadLesson() {

    if (!courseId || !lessonId) {

        showError(
            "Lesson information is missing."
        );

        return;
    }


    try {

        const courseRef =
            doc(
                db,
                "courses",
                courseId
            );


        const courseSnapshot =
            await getDoc(courseRef);


        if (!courseSnapshot.exists()) {

            showError(
                "Course not found."
            );

            return;
        }


        const course =
            courseSnapshot.data();


        backToCourse.href =
            `course.html?id=${encodeURIComponent(
                courseId
            )}`;


        const lessonRef =
            doc(
                db,
                "courses",
                courseId,
                "lessons",
                lessonId
            );


        const lessonSnapshot =
            await getDoc(lessonRef);


        if (!lessonSnapshot.exists()) {

            showError(
                "Lesson not found."
            );

            return;
        }


        const lesson =
            lessonSnapshot.data();


        title.textContent =
            lesson.title ||
            "Untitled Lesson";


        description.textContent =
            lesson.description ||
            "";


        lessonNumber.textContent =
            `Lesson ${lesson.order || ""}`;


        lessonText.textContent =
            lesson.content ||
            lesson.text ||
            "No lesson content available.";


        if (lesson.code) {

            lessonCode.textContent =
                lesson.code;

            codeSection.style.display =
                "block";

        }


        const userRef =
            doc(
                db,
                "users",
                currentUser.uid
            );


        const userSnapshot =
            await getDoc(userRef);


        if (userSnapshot.exists()) {

            const userData =
                userSnapshot.data();


            const completed =
                Array.isArray(
                    userData.completedLessons
                )
                    ? userData.completedLessons
                    : [];


            if (
                completed.includes(lessonId)
            ) {

                completeButton.textContent =
                    "Lesson Completed ✓";

                completeButton.disabled =
                    true;

            }

        }


        loading.style.display =
            "none";

        content.style.display =
            "block";


        document.title =
            `${lesson.title || "Lesson"} | EduBright`;


    } catch (error) {

        console.error(
            "Lesson loading error:",
            error
        );

        showError(
            "Could not load this lesson."
        );

    }

}


/* -------------------------
   Complete lesson
------------------------- */

completeButton.addEventListener(
    "click",
    async () => {

        if (!currentUser) {

            window.location.href =
                "login.html";

            return;
        }


        completeButton.disabled =
            true;

        completeButton.textContent =
            "Saving...";


        try {

            const userRef =
                doc(
                    db,
                    "users",
                    currentUser.uid
                );


            const userSnapshot =
                await getDoc(userRef);


            if (!userSnapshot.exists()) {

                throw new Error(
                    "User profile does not exist."
                );
            }


            const userData =
                userSnapshot.data();


            const completed =
                Array.isArray(
                    userData.completedLessons
                )
                    ? userData.completedLessons
                    : [];


            /*
             * Don't award XP twice.
             */

            if (
                completed.includes(lessonId)
            ) {

                completeButton.textContent =
                    "Lesson Completed ✓";

                return;
            }


            const currentXP =
                Number(
                    userData.xp || 0
                );


            const newXP =
                currentXP + 10;


            const newLevel =
                Math.floor(
                    newXP / 100
                ) + 1;


            await updateDoc(
                userRef,
                {

                    completedLessons:
                        arrayUnion(
                            lessonId
                        ),

                    xp:
                        increment(10),

                    level:
                        newLevel

                }
            );


            completeButton.textContent =
                "Lesson Completed ✓";


            message.textContent =
                "+10 XP earned! 🎉";


            message.style.color =
                "#16a34a";


            showNextLesson();


        } catch (error) {

            console.error(
                "Completion error:",
                error
            );


            completeButton.disabled =
                false;

            completeButton.textContent =
                "Mark Lesson Complete ✓";


            message.textContent =
                "Could not save your progress.";

            message.style.color =
                "#dc2626";

        }

    }
);


/* -------------------------
   Copy code
------------------------- */

copyCode.addEventListener(
    "click",
    async () => {

        try {

            await navigator.clipboard.writeText(
                lessonCode.textContent
            );


            copyCode.textContent =
                "Copied ✓";


            setTimeout(() => {

                copyCode.textContent =
                    "Copy";

            }, 1500);


        } catch (error) {

            console.error(
                "Copy error:",
                error
            );

        }

    }
);


/* -------------------------
   Next lesson
------------------------- */

async function showNextLesson() {

    /*
     * The next-lesson button will be
     * enabled when another lesson
     * exists in this course.
     *
     * For now, return to the course
     * after completing the lesson.
     */

    const nextButton =
        document.getElementById(
            "nextLessonBtn"
        );


    nextButton.href =
        `course.html?id=${encodeURIComponent(
            courseId
        )}`;


    nextButton.textContent =
        "Back to Course →";


    nextButton.style.display =
        "inline-flex";

}


/* -------------------------
   Error
------------------------- */

function showError(text) {

    loading.innerHTML = `

        <h2>
            ${escapeHTML(text)}
        </h2>

        <br>

        <a
            href="courses.html"
            class="btn btn-primary">

            ← Back to Courses

        </a>

    `;

}


/* -------------------------
   Security
------------------------- */

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

    }
