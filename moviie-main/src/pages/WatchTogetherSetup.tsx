import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Intro } from "../companents/Intro";
import {
    createGroupId, 
    createParticipantId,
    createGroupInvitation,
    getFavouriteMovies,
    GROUP_MIN_PARTICIPANTS,
    GROUP_MAX_PARTICIPANTS,
type ParticipantResult,
} from "../modul";

const GROUP_STORAGE_KEY = "moviies:group-session:v2";

function WatchTogetherSetup() {
const [name, setName] = useState("");
const [participantCount, setParticipantCount] = useState(2);
const [error, setError] = useState("");
const nav = useNavigate();

const handleCreateGroup = () => {
    const organizerName = name.trim();

    if (!organizerName) {
        setError("Please enter your name.");
        return;
    }

    const favouriteMovies = getFavouriteMovies();

    if (favouriteMovies.length === 0) {
        setError("Your Favourites list is empty. Add some movies first.");
        return;
    }

    const groupId = createGroupId();
    const organizerId = createParticipantId();

    const participants = [
        {
            id: organizerId,
            name: organizerName,
        },
        ...Array.from(
            { length: participantCount - 1 },
            (_, index) => ({
                id: createParticipantId(),
                name: `Participant ${index + 2}`,
            })
        ),
    ];

    const invitation = createGroupInvitation(
        groupId,
        favouriteMovies.map((movie) => movie.id),
        participants
    );

    if (!invitation) {
        setError("Something went wrong while creating the group.");
        return;
    }

    const organizer: ParticipantResult = {
        id: organizerId,
        name: organizerName,
        likedIds: [],
        dislikedIds: [],
    };

    const groupSession = {
        invitation,
        organizer,
        participantCount,
        participants,
    };

    try {
        localStorage.setItem(
            GROUP_STORAGE_KEY,
            JSON.stringify(groupSession)
        );
    } catch {
        setError("Could not save the group. Please try again.");
        return;
    }

    nav("/group-share");
};

return (
    <Intro showChoiceButton={false}>
        <main className="main group-setup-page">
            <section className="main_content">
                <p className="home-eyebrow">
                    YOUR MOVIE NIGHT STARTS HERE
                </p>

                <h1 className="main_title">
                    Watch Together
                </h1>

                <p className="main_description">
                    Create a group and discover movies everyone will love.
                </p>

                <div className="group-setup-form">
                    <label htmlFor="organizer-name">
                        Your name
                    </label>

                    <input
                        id="organizer-name"
                        type="text"
                        value={name}
                        onChange={(event) => {
                            setName(event.target.value);
                            setError("");
                        }}
                        placeholder="Enter your name"
                        maxLength={30}
                    />

                    <label htmlFor="participant-count">
                        Number of participants
                    </label>

                    <select
                        id="participant-count"
                        value={participantCount}
                        onChange={(event) => {
                            setParticipantCount(Number(event.target.value));
                            setError("");
                        }}
                    >
                        {Array.from(
                            {
                                length:
                                    GROUP_MAX_PARTICIPANTS -
                                    GROUP_MIN_PARTICIPANTS + 1,
                            },
                            (_, index) => index + GROUP_MIN_PARTICIPANTS
                        ).map((count) => (
                            <option key={count} value={count}>
                                {count} participants
                            </option>
                        ))}
                    </select>

                    <p className="group-setup-note">
                        You are included in the participant count.
                        Everyone will vote separately.
                    </p>

                    {error && (
                        <p className="group-setup-error" role="alert">
                            {error}
                        </p>
                    )}

                    <button
                        className="primary"
                        onClick={handleCreateGroup}
                    >
                        Create group
                    </button>
                </div>
            </section>
        </main>
    </Intro>
);
}

export { WatchTogetherSetup };