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
    document.getElementById("quizLoading");

const content =
    document.getElementById("quizContent");

const quizTitle =
    document.getElementById("quizTitle");

const questionContainer =
    document.getElementById(
        "questionContainer"
    );

const answersContainer =
    document.getElementById(
        "answersContainer"
    );

const nextButton =
    document.getElementById(
        "nextQuestionBtn"
    );

const progress =
    document.getElementById(
        "quizProgress"
    );

const result =
    document.getElementById(
        "quizResult"
    );

const scoreText =
    document.getElementById(
        "scoreText"
    );

const resultMessage =
    document.getElementById(
        "resultMessage"
    );


const params =
    new URLSearchParams(
        window.location.search
    );

const courseId =
    params.get("course");

const quizId =
    params.get("quiz");


let currentUser = null;

let questions = [];

let currentQuestion = 0;

let score = 0;

let selectedAnswer = null;


/* =========================
   AUTH
========================= */

onAuthStateChanged(
    auth,
    async (user) => {

        if (!user) {

            window.location.href =
                "login.html";

            return;
        }

        currentUser = user;

        await loadQuiz();

    }
);


/* =========================
   LOAD QUIZ
========================= */

async function loadQuiz() {

    if (!courseId || !quizId) {

        showError(
            "Quiz information is missing."
        );

        return;
    }


    try {

        const quizRef =
            doc(
                db,
                "courses",
                courseId,
                "quizzes",
                quizId
            );


        const snapshot =
            await getDoc(quizRef);


        if (!snapshot.exists()) {

            showError(
                "Quiz not found."
            );

            return;
        }


        const quiz =
            snapshot.data();


        quizTitle.textContent =
            quiz.title ||
            "Quiz";


        questions =
            Array.isArray(
                quiz.questions
            )
                ? quiz.questions
                : [];


        if (questions.length === 0) {

            showError(
                "This quiz has no questions yet."
            );

            return;
        }


        loading.style.display =
            "none";

        content.style.display =
            "block";


        showQuestion();

    } catch (error) {

        console.error(
            "Quiz error:",
            error
        );

        showError(
            "Could not load quiz."
        );

    }

}


/* =========================
   SHOW QUESTION
========================= */

function showQuestion() {

    selectedAnswer = null;


    const question =
        questions[currentQuestion];


    progress.textContent =
        `Question ${
            currentQuestion + 1
        } of ${
            questions.length
        }`;


    questionContainer.innerHTML = `

        <h2>
            ${escapeHTML(
                question.question ||
                "Question"
            )}
        </h2>

    `;


    answersContainer.innerHTML = "";


    const answers =
        Array.isArray(
            question.answers
        )
            ? question.answers
            : [];


    answers.forEach(
        (answer, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "lesson-button";


            button.textContent =
                answer;


            button.addEventListener(
                "click",
                () => {

                    selectedAnswer =
                        index;


                    document
                        .querySelectorAll(
                            ".lesson-button"
                        )
                        .forEach(
                            (btn) => {

                                btn.style.borderColor =
                                    "";

                            }
                        );


                    button.style.borderColor =
                        "#2563eb";

                }
            );


            answersContainer
                .appendChild(button);

        }
    );


    nextButton.textContent =
        currentQuestion ===
        questions.length - 1

            ? "Finish Quiz"

            : "Next Question →";

}


/* =========================
   NEXT
========================= */

nextButton.addEventListener(
    "click",
    async () => {

        if (selectedAnswer === null) {

            alert(
                "Please choose an answer."
            );

            return;
        }


        const question =
            questions[currentQuestion];


        if (
            selectedAnswer ===
            Number(
                question.correctAnswer
            )
        ) {

            score++;

        }


        currentQuestion++;


        if (
            currentQuestion <
            questions.length
        ) {

            showQuestion();

        } else {

            await finishQuiz();

        }

    }
);


/* =========================
   FINISH QUIZ
========================= */

async function finishQuiz() {

    nextButton.style.display =
        "none";

    answersContainer.style.display =
        "none";

    questionContainer.style.display =
        "none";


    const percentage =
        Math.round(
            (score /
                questions.length) *
            100
        );


    scoreText.textContent =
        `${score}/${questions.length} — ${percentage}%`;


    if (percentage >= 80) {

        resultMessage.textContent =
            "Excellent! 🎉 You passed the quiz.";

    }

    else if (percentage >= 60) {

        resultMessage.textContent =
            "Good job! Keep learning. 👍";

    }

    else {

        resultMessage.textContent =
            "Keep practicing and try again. 💪";

    }


    result.style.display =
        "block";


    /*
     * Give XP only once for this quiz.
     */

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
            return;
        }


        const userData =
            userSnapshot.data();


        const completedQuizzes =
            Array.isArray(
                userData.quizScores
            )
                ? userData.quizScores
                : [];


        const alreadyCompleted =
            completedQuizzes.some(
                (item) =>
                    item.quizId === quizId
            );


        if (!alreadyCompleted) {

            const xpReward =
                percentage >= 60
                    ? 25
                    : 5;


            const currentXP =
                Number(
                    userData.xp || 0
                );


            const newXP =
                currentXP +
                xpReward;


            const newLevel =
                Math.floor(
                    newXP / 100
                ) + 1;


            await updateDoc(
                userRef,
                {

                    xp:
                        increment(
                            xpReward
                        ),

                    level:
                        newLevel,

                    quizScores:
                        arrayUnion({

                            quizId:
                                quizId,

                            score:
                                score,

                            total:
                                questions.length,

                            percentage:
                                percentage

                        })

                }
            );

        }

    } catch (error) {

        console.error(
            "Could not save quiz:",
            error
        );

    }

}


/* =========================
   ERROR
========================= */

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


/* =========================
   SECURITY
========================= */

function escapeHTML(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}
