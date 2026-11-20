import { useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Intro } from "../companents/Intro";

const GROUP_STORAGE_KEY = "moviies:group-session:v2";

function encodePayload(payload: object) {
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
function GroupSharePage() {
    const [copiedId, setCopiedId] = useState("");
    let groupSession: any = null;

try {
    const saved = localStorage.getItem(GROUP_STORAGE_KEY);
    groupSession = saved ? JSON.parse(saved) : null;
} catch {
    groupSession = null;
}

if (!groupSession?.invitation || !groupSession?.participants) {
    return (
        <Intro showChoiceButton={false}>
            <div className="center-block">
                <h2>Group not found</h2>
                <Link to="/watch-together-setup">
                    Create a new group
                </Link>
            </div>
        </Intro>
    );
}

const invitation = groupSession.invitation;
const organizerCompleted =
    Array.isArray(groupSession.organizerVotes) &&
    groupSession.organizerVotes.length === invitation.movieIds.length;

const invitedParticipants = groupSession.participants.filter(
    (participant: { id: string }) =>
        participant.id !== groupSession.organizer.id
);

const createLink = (participant: {
    id: string;
    name: string;
}) => {
    const payload = {
        v: 2,
        type: "participant-invitation",
        groupId: invitation.groupId,
        dataset: "movies-v1",
        movieIds: invitation.movieIds,
        participant,
    };

    return (
        `${window.location.origin}/group-join#p=` +
        encodePayload(payload)
    );
};

const copyLink = async (participant: {
    id: string;
    name: string;
}) => {
    try {
        await navigator.clipboard.writeText(createLink(participant));
        setCopiedId(participant.id);
    } catch {
        setCopiedId("");
    }
};

return (
    <Intro showChoiceButton={false}>
        <main className="group-share-page">
            <section className="group-share-content">
                <p className="home-eyebrow">
                    YOUR GROUP IS READY
                </p>

                <h1>Invite your friends</h1>

                <p>
                    Scan the QR code or copy an invitation link.
                    Each participant will enter their name and vote
                    on their own device.
                </p>

                <div className="group-share-organizer">
                    <span>Organizer</span>
                    <strong>{groupSession.organizer.name}</strong>
                </div>

                <Link
    to={organizerCompleted ? "/group-results" : "/group-organizer-game"}
    className="primary group-start-button"
>
    {organizerCompleted ? "View group results" : "Start voting"}
    <span>→</span>
</Link>

                <div className="group-share-list">
                    {invitedParticipants.map(
                        (participant: {
                            id: string;
                            name: string;
                        }, index: number) => {
                            const link = createLink(participant);

                            return (
                                <article
                                    className="group-share-card"
                                    key={participant.id}
                                >
                                    <p>
                                        Participant {index + 2}
                                    </p>

                                    <div className="group-share-qr">
                                        <QRCodeSVG
                                            value={link}
                                            size={180}
                                            marginSize={2}
                                        />
                                    </div>

                                    <button
                                        className="outline-button"
                                        onClick={() =>
                                            copyLink(participant)
                                        }
                                    >
                                    {copiedId === participant.id
                                            ? "Copied!"
                                            : "Copy invitation link"}
                                    </button>
                                </article>
                            );
                        }
                    )}
                </div>

                <p className="group-share-note">
                    You can invite up to {invitedParticipants.length}
                    {" "}other participants.
                </p>
            </section>
        </main>
    </Intro>
);
}

export { GroupSharePage };