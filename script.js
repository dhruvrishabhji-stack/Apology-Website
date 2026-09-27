/* ==================================================
   SUPABASE BACKEND URL
================================================== */

const API_URL =
    "https://lkxehnmnbmlewsagppew.supabase.co/functions/v1/apology";


/* ==================================================
   ELEMENTS
================================================== */

const creatorPage =
    document.getElementById("creatorPage");

const receiverPage =
    document.getElementById("receiverPage");

const apologyForm =
    document.getElementById("apologyForm");

const linkBox =
    document.getElementById("linkBox");

const generatedLink =
    document.getElementById("generatedLink");

const copyButton =
    document.getElementById("copyButton");

const copyMessage =
    document.getElementById("copyMessage");

const creatorError =
    document.getElementById("creatorError");

const receiverError =
    document.getElementById("receiverError");


/* ==================================================
   APOLOGY STATE
================================================== */

let apologyData = null;

let rejectionLevel = 0;


/* ==================================================
   REJECTION MESSAGES
================================================== */

const rejectionResponses = [

    {
        emoji: "🥺",

        title:
            "Wait... really? 😭",

        text:
            "I know you're still angry, but please give me another chance. 🥺"
    },

    {

        emoji: "😔",

        title:
            "Okay... I understand.",

        text:
            "But I really mean my apology. Can we at least talk about it? 💔"
    },

    {

        emoji: "🐶",

        title:
            "Look at this face... 🥺",

        text:
            "How can you stay angry after seeing this level of cuteness? 😭"
    },

    {

        emoji: "🧎",

        title:
            "Okay okay... I'm begging.",

        text:
            "I admit it. I messed up. Please forgive me. 🙏"
    },

    {

        emoji: "😭",

        title:
            "MY HEART 💔",

        text:
            "You've rejected my apology so many times that I'm emotionally buffering..."
    },

    {

        emoji: "🥹",

        title:
            "One last chance?",

        text:
            "I promise I'll try to do better. Friends? 🥺🤝"
    },

    {

        emoji: "💀",

        title:
            "You really won't forgive me?!",

        text:
            "Okay... this friendship is now officially under negotiation. 😭"
    }

];


/* ==================================================
   CREATE APOLOGY
================================================== */

apologyForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        creatorError.textContent = "";

        const sender =
            document
                .getElementById("sender")
                .value
                .trim();

        const receiver =
            document
                .getElementById("receiver")
                .value
                .trim();

        const message =
            document
                .getElementById("message")
                .value
                .trim();


        if (
            !sender ||
            !receiver ||
            !message
        ) {

            creatorError.textContent =
                "Please fill in everything.";

            return;
        }


        const button =
            document.getElementById(
                "createButton"
            );

        button.disabled = true;

        button.textContent =
            "Creating your apology... 💌";


        try {

            const response =
                await fetch(
                    API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                sender,
                                receiver,
                                message
                            })
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.error ||
                    "Could not create apology."
                );

            }


            /*
             * ONLY THE ID GOES INTO THE URL.
             */

            const apologyURL =
                window.location.origin +
                window.location.pathname +
                "?id=" +
                encodeURIComponent(
                    result.id
                );


            generatedLink.value =
                apologyURL;

            linkBox.style.display =
                "block";


            linkBox.scrollIntoView({
                behavior: "smooth"
            });


        } catch (error) {

            creatorError.textContent =
                error.message;

        } finally {

            button.disabled =
                false;

            button.textContent =
                "Create Apology Link 💌";

        }

    }
);


/* ==================================================
   COPY LINK
================================================== */

copyButton.addEventListener(
    "click",
    async function () {

        try {

            await navigator.clipboard.writeText(
                generatedLink.value
            );

            copyMessage.textContent =
                "Copied! Send it to your friend 💌";

        } catch {

            generatedLink.select();

            document.execCommand(
                "copy"
            );

            copyMessage.textContent =
                "Copied! Send it to your friend 💌";

        }

    }
);


/* ==================================================
   LOAD APOLOGY
================================================== */

async function loadApology() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const id =
        params.get("id");


    /*
     * No ID means this is
     * the creator page.
     */

    if (!id) {

        creatorPage.style.display =
            "block";

        receiverPage.style.display =
            "none";

        return;
    }


    /*
     * ID exists.
     * Show receiver page.
     */

    creatorPage.style.display =
        "none";

    receiverPage.style.display =
        "block";


    try {

        const response =
            await fetch(
                API_URL +
                "?id=" +
                encodeURIComponent(id)
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.error ||
                "Apology not found."
            );

        }


        apologyData =
            result.apology;


        document
            .getElementById(
                "receiverTitle"
            )
            .textContent =
                `${apologyData.receiver}, someone wants to say sorry... 🥺`;


        document
            .getElementById(
                "introText"
            )
            .textContent =
                `${apologyData.sender_name} has something to tell you.`;


        document
            .getElementById(
                "apologyMessage"
            )
            .textContent =
                apologyData.message;


    } catch (error) {

        receiverError.textContent =
            error.message;

    }

}


/* ==================================================
   FORGIVE
================================================== */

document
    .getElementById("forgiveButton")
    .addEventListener(
        "click",
        forgive
    );


function forgive() {

    document
        .getElementById(
            "apologyScreen"
        )
        .style.display =
            "none";


    document
        .getElementById(
            "successScreen"
        )
        .style.display =
            "block";


    document
        .getElementById(
            "successText"
        )
        .textContent =
            `${apologyData.sender_name} can finally breathe again! 😭💗`;


    createConfetti();

}


/* ==================================================
   DON'T FORGIVE
================================================== */

document
    .getElementById("rejectButton")
    .addEventListener(
        "click",
        notForgive
    );


function notForgive() {

    rejectionLevel++;


    const response =
        document.getElementById(
            "response"
        );


    /*
     * FINAL STAGE
     *
     * Only ONE button.
     */

    if (
        rejectionLevel >=
        rejectionResponses.length
    ) {

        response.innerHTML = `

            <h2>
                You really won't forgive me?! 😭
            </h2>

            <p>
                Okay... this friendship is now
                officially under negotiation. 😭
            </p>

            <button
                class="btn forgive"
                id="finalForgiveButton"
            >
                Okay, I forgive you
                ${escapeHTML(
                    apologyData.sender_name
                )} 💖
            </button>

        `;


        document
            .getElementById(
                "finalForgiveButton"
            )
            .addEventListener(
                "click",
                forgive
            );


        return;
    }


    const current =
        rejectionResponses[
            rejectionLevel - 1
        ];


    document
        .getElementById(
            "mainEmoji"
        )
        .textContent =
            current.emoji;


    response.innerHTML = `

        <h2>
            ${current.title}
        </h2>

        <p>
            ${current.text}
        </p>

        <button
            class="btn forgive"
            id="responseForgiveButton"
        >
            Okay, I forgive you
            ${escapeHTML(
                apologyData.sender_name
            )} 💖
        </button>

        <button
            class="btn reject small-btn"
            id="stillNoButton"
        >
            Still no 😤
        </button>

    `;


    document
        .getElementById(
            "responseForgiveButton"
        )
        .addEventListener(
            "click",
            forgive
        );


    document
        .getElementById(
            "stillNoButton"
        )
        .addEventListener(
            "click",
            notForgive
        );


    response.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* ==================================================
   BASIC HTML ESCAPING
================================================== */

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* ==================================================
   FLOATING HEARTS
================================================== */

function createHeart() {

    const heart =
        document.createElement(
            "div"
        );

    heart.className =
        "heart";


    const hearts = [
        "💗",
        "💖",
        "💕",
        "💓",
        "🌸",
        "✨"
    ];


    heart.textContent =
        hearts[
            Math.floor(
                Math.random() *
                hearts.length
            )
        ];


    heart.style.left =
        Math.random() * 100 +
        "vw";


    heart.style.animationDuration =
        4 +
        Math.random() * 5 +
        "s";


    heart.style.fontSize =
        15 +
        Math.random() * 20 +
        "px";


    document.body.appendChild(
        heart
    );


    setTimeout(
        () => heart.remove(),
        9000
    );

}


setInterval(
    createHeart,
    700
);


/* ==================================================
   CONFETTI
================================================== */

function createConfetti() {

    const symbols = [
        "💖",
        "💕",
        "🎉",
        "✨",
        "🌸",
        "🥳",
        "💗"
    ];


    for (
        let i = 0;
        i < 70;
        i++
    ) {

        const confetti =
            document.createElement(
                "div"
            );


        confetti.className =
            "confetti";


        confetti.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        confetti.style.left =
            Math.random() * 100 +
            "vw";


        confetti.style.animationDuration =
            2 +
            Math.random() * 3 +
            "s";


        confetti.style.animationDelay =
            Math.random() * 1.5 +
            "s";


        document.body.appendChild(
            confetti
        );


        setTimeout(
            () => confetti.remove(),
            5000
        );

    }

}


/* ==================================================
   START
================================================== */

loadApology();
