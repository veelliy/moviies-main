import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Intro } from "../companents/Intro";

const GROUP_STORAGE_KEY = "moviies:group-session:v2";

type ParticipantSubmission = {
v: 2;
type: "participant-submission";
groupId: string;
dataset: "movies-v1";
participant: {
id: string;
name: string;
likedIds: string[];
dislikedIds: string[];
};
};

function decodeSubmission(encoded: string): ParticipantSubmission | null {
try {
if (
!encoded ||
encoded.length > 10000 ||
!/^[A-Za-z0-9_-]+$/.test(encoded)
) {
return null;
}
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
        data.type !== "participant-submission" ||
        data.dataset !== "movies-v1" ||
        typeof data.groupId !== "string" ||
        typeof data.participant?.id !== "string" ||
        typeof data.participant?.name !== "string" ||
        !Array.isArray(data.participant.likedIds) ||
        !Array.isArray(data.participant.dislikedIds) ||
        !data.participant.likedIds.every(
            (id: unknown) => typeof id === "string"
        ) ||
        !data.participant.dislikedIds.every(
            (id: unknown) => typeof id === "string"
        )
    ) {
        return null;
    }

    return data as ParticipantSubmission;
} catch {
    return null;
}
}

function GroupImportPage() {
const location = useLocation();
const [message, setMessage] = useState("Checking invitation...");
const [showResultsLink, setShowResultsLink] = useState(false);
const encoded = new URLSearchParams(
    location.hash.slice(1)
).get("s");

useEffect(() => {
    if (!encoded) {
        setMessage("Results link not found.");
        return;
    }

    const submission = decodeSubmission(encoded);

    if (!submission) {
        setMessage("This results link is invalid.");
        return;
    }

    try {
        const saved = localStorage.getItem(GROUP_STORAGE_KEY);

        if (!saved) {
            setMessage(
                "This group was not found on this device. Open the link on the organizer's device."
            );
            return;
        }

        const groupSession = JSON.parse(saved);

        if (
            groupSession.invitation?.groupId !== submission.groupId
        ) {
            setMessage(
                "These results belong to a different group."
            );
            return;
        }

        const movieIds: string[] =
            groupSession.invitation.movieIds;

        const participant = submission.participant;

        const expectedParticipant =
            groupSession.participants?.find(
                (item: { id: string }) =>
                    item.id === participant.id
            );

        if (!expectedParticipant) {
            setMessage(
                "This participant is not part of your group."
            );
            return;
        }

        expectedParticipant.name = participant.name;

        const allVotes = [
            ...participant.likedIds,
            ...participant.dislikedIds,
        ];

        const uniqueVotes = new Set(allVotes);

        const validMovieIds = new Set(movieIds);

        if (
            uniqueVotes.size !== allVotes.length ||
            allVotes.length !== movieIds.length ||
            !allVotes.every((id) => validMovieIds.has(id))
        ) {
            setMessage(
                "The submitted votes do not match the group's movie list."
            );
            return;
        }

        const submissions = Array.isArray(groupSession.submissions)
            ? groupSession.submissions
            : [];
            const alreadyImported = submissions.some(
                (item: ParticipantSubmission) =>
                    item.participant.id === participant.id
            );
    
            if (alreadyImported) {
                setMessage(
                    `${participant.name}'s results have already been added.`
                );
                return;
            }
    
            groupSession.submissions = [
                ...submissions,
                submission,
            ];
    
            localStorage.setItem(
                GROUP_STORAGE_KEY,
                JSON.stringify(groupSession)
            );
    
            setMessage(
                `${participant.name}'s results were successfully added!`
            );
            setShowResultsLink(true);
        } catch {
            setMessage("Something went wrong while importing the results.");
        }
    }, [encoded]);
    
    return (
        <Intro showChoiceButton={false}>
            <main className="group-import-page">
                <section className="group-import-content">
                    <p className="home-eyebrow">
                        GROUP RESULTS
                    </p>
    
                    <h1>Import participant results</h1>
    
                    <p>{message}</p>
                    {showResultsLink && (
    <Link to="/group-results" className="primary">
        View group results →
    </Link>
)}
    
                    <Link to="/the-choice">
                        Back to The Choice
                    </Link>
                </section>
            </main>
        </Intro>
    );
}

export { GroupImportPage };