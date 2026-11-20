import { useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Intro } from "../companents/Intro";

const PARTICIPANT_STORAGE_KEY = "moviies:group-participant:v2";

function encodeSubmission(payload: object) {
const bytes = new TextEncoder().encode(JSON.stringify(payload));
let binary = "";
bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
});

return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
}

function GroupSubmitPage() {
const [copied, setCopied] = useState(false);
let session: any = null;

try {
    const saved = localStorage.getItem(PARTICIPANT_STORAGE_KEY);
    session = saved ? JSON.parse(saved) : null;
} catch {
    session = null;
}

if (
    !session ||
    session.v !== 2 ||
    session.type !== "participant-invitation" ||
    !Array.isArray(session.likedIds) ||
    !Array.isArray(session.dislikedIds) ||
    !session.participant
) {
    return (
        <Intro showChoiceButton={false}>
            <div className="center-block">
                <h2>Results not found</h2>
                <Link to="/the-choice">Back to The Choice</Link>
            </div>
        </Intro>
    );
}

const submission = {
    v: 2,
    type: "participant-submission",
    groupId: session.groupId,
    dataset: "movies-v1",
    participant: {
        id: session.participant.id,
        name: session.participant.name,
        likedIds: session.likedIds,
        dislikedIds: session.dislikedIds,
    },
};

const link =
    `${window.location.origin}/group-import#s=` +
    encodeSubmission(submission);

const copyLink = async () => {
    try {
        await navigator.clipboard.writeText(link);
        setCopied(true);
    } catch {
        setCopied(false);
    }
};

return (
    <Intro showChoiceButton={false}>
        <main className="group-submit-page">
            <section className="group-submit-content">
                <p className="home-eyebrow">
                    YOUR VOTES ARE COMPLETE
                </p>

                <h1>You're all done!</h1>

                <p>
                    {session.participant.name}, your votes have been saved.
                    Send your results to the group organizer.
                </p>

                <div className="group-submit-summary">
                    <div>
                        <strong>{session.likedIds.length}</strong>
                        <span>Liked</span>
                    </div>

                    <div>
                        <strong>{session.dislikedIds.length}</strong>
                        <span>Disliked</span>
                    </div>
                </div>

                <div className="group-submit-qr">
                    <QRCodeSVG
                        value={link}
                        size={210}
                        marginSize={2}
                    />
                </div>

                <button
                    className="outline-button"
                    onClick={copyLink}
                >
                    {copied ? "Copied!" : "Copy results link"}
                </button>

                <p className="group-submit-note">
                    The organizer can scan this QR code or open your link
                    to add your votes to the group results.
                </p>
            </section>
        </main>
    </Intro>
);
}

export { GroupSubmitPage };