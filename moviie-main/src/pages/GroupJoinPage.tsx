import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Intro } from "../companents/Intro";

const PARTICIPANT_STORAGE_KEY = "moviies:group-participant:v2";

type ParticipantInvitation = {
v: 2;
type: "participant-invitation";
groupId: string;
dataset: "movies-v1";
movieIds: string[];
participant: {
id: string;
name: string;
};
};

function decodeParticipantInvitation(
encoded: string
): ParticipantInvitation | null {
try {
if (!/^[A-Za-z0-9_-]+$/.test(encoded)) return null;
const base = encoded
        .replaceAll("-", "+")
        .replaceAll("_", "/");

    const padded = base.padEnd(
        Math.ceil(base.length / 4) * 4,
        "="
    );

    const bytes = Uint8Array.from(
        atob(padded),
        (character) => character.charCodeAt(0)
    );

    const data = JSON.parse(
        new TextDecoder("utf-8", { fatal: true }).decode(bytes)
    );

    if (
        data.v !== 2 ||
        data.type !== "participant-invitation" ||
        data.dataset !== "movies-v1" ||
        typeof data.groupId !== "string" ||
        !Array.isArray(data.movieIds) ||
        !data.movieIds.every((id: unknown) => typeof id === "string") ||
        typeof data.participant?.id !== "string"
    ) {
        return null;
    }

    return data as ParticipantInvitation;
} catch {
    return null;
}
}
function GroupJoinPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [name, setName] = useState("");
const [error, setError] = useState("");

const encoded = new URLSearchParams(
    location.hash.slice(1)
).get("p");

const invitation = encoded
    ? decodeParticipantInvitation(encoded)
    : null;

const handleJoin = () => {
    const participantName = name.trim();

    if (!participantName) {
        setError("Please enter your name.");
        return;
    }

    if (!invitation) {
        setError("This invitation is invalid or expired.");
        return;
    }

    const participantSession = {
        ...invitation,
        participant: {
            ...invitation.participant,
            name: participantName,
        },
        likedIds: [],
        dislikedIds: [],
    };

    try {
        localStorage.setItem(
            PARTICIPANT_STORAGE_KEY,
            JSON.stringify(participantSession)
        );

        navigate("/group-game");
    } catch {
        setError("Could not save your invitation. Please try again.");
    }
};

if (!invitation) {
    return (
        <Intro showChoiceButton={false}>
            <div className="center-block">
                <h2>Invitation not found</h2>
                <p>Please check the invitation link.</p>
            </div>
        </Intro>
    );
}

return (
    <Intro showChoiceButton={false}>
        <main className="main group-join-page">
            <section className="main_content">
                <p className="home-eyebrow">
                    YOU HAVE BEEN INVITED
                </p>

                <h1 className="main_title">
                    Join the movie night
                </h1>

                <p className="main_description">
                    Enter your name and get ready to discover
                    movies with your group.
                </p>

                <div className="group-join-form">
                    <label htmlFor="participant-name">
                        Your name
                    </label>

                    <input
                        id="participant-name"
                        type="text"
                        value={name}
                        onChange={(event) => {
                            setName(event.target.value);
                            setError("");
                        }}
                        placeholder="Enter your name"
                        maxLength={30}
                    />

                    {error && (
                        <p role="alert" className="group-setup-error">
                            {error}
                        </p>
                    )}

                    <button
                    className="primary"
                    onClick={handleJoin}
                >
                    Join group
                </button>
            </div>
        </section>
    </main>
</Intro>
);
}

export { GroupJoinPage };