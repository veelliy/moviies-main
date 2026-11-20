import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, HeartCrack, RotateCcw } from "lucide-react";
import { Header } from "../companents/Header";
import { SwipeCard } from "../companents/SwipeCard";
import { movies, shuffle } from "../modul";

const PARTICIPANT_STORAGE_KEY = "moviies:group-participant:v2";

type GroupParticipantSession = {
v: 2;
type: "participant-invitation";
groupId: string;
dataset: "movies-v1";
movieIds: string[];
participant: {
id: string;
name: string;
};
likedIds: string[];
dislikedIds: string[];
order: string[];
votes: { id: string; liked: boolean }[];
};

function loadParticipantSession(): GroupParticipantSession | null {
try {
const saved = localStorage.getItem(PARTICIPANT_STORAGE_KEY);
if (!saved) return null;
const session = JSON.parse(saved);

    if (
        session.v !== 2 ||
        session.type !== "participant-invitation" ||
        !Array.isArray(session.movieIds) ||
        !session.participant?.id
    ) {
        return null;
    }

    const order =
        Array.isArray(session.order) && session.order.length > 0
            ? session.order
            : shuffle([...session.movieIds]);

    const updatedSession: GroupParticipantSession = {
        ...session,
        order,
        votes: Array.isArray(session.votes) ? session.votes : [],
        likedIds: Array.isArray(session.likedIds)
            ? session.likedIds
            : [],
        dislikedIds: Array.isArray(session.dislikedIds)
            ? session.dislikedIds
            : [],
    };

    localStorage.setItem(
        PARTICIPANT_STORAGE_KEY,
        JSON.stringify(updatedSession)
    );

    return updatedSession;
} catch {
    return null;
}
}

function GroupGamePage() {
const navigate = useNavigate();
const [session, setSession] = useState<GroupParticipantSession | null>(
    () => loadParticipantSession()
);

const [locked, setLocked] = useState(false);

useEffect(() => {
    if (!session) {
        navigate("/group-join", { replace: true });
        return;
    }

    if (session.votes.length >= session.order.length) {
        navigate("/group-submit", { replace: true });
    }
}, [session, navigate]);

if (!session) return null;

const currentIndex = session.votes.length;
const currentId = session.order[currentIndex];
const movie = movies.find((item) => item.id === currentId);

const update = (liked: boolean) => {
    if (locked || !movie) return;

    setLocked(true);

    const next: GroupParticipantSession = {
        ...session,
        votes: [
            ...session.votes,
            { id: movie.id, liked },
        ],
        likedIds: liked
            ? [...session.likedIds, movie.id]
            : session.likedIds,
        dislikedIds: !liked
            ? [...session.dislikedIds, movie.id]
            : session.dislikedIds,
    };

    localStorage.setItem(
        PARTICIPANT_STORAGE_KEY,
        JSON.stringify(next)
    );

    setSession(next);
    setLocked(false);
};

const undo = () => {
    if (!session.votes.length || locked) return;

    const lastVote = session.votes[session.votes.length - 1];

    const next: GroupParticipantSession = {
        ...session,
        votes: session.votes.slice(0, -1),
        likedIds: session.likedIds.filter(
            (id) => !(lastVote.id === id && lastVote.liked)
        ),
        dislikedIds: session.dislikedIds.filter(
            (id) => !(lastVote.id === id && !lastVote.liked)
        ),
    };

    localStorage.setItem(
        PARTICIPANT_STORAGE_KEY,
        JSON.stringify(next)
    );

    setSession(next);
};

return (
    <main className="workspace">
        <Header />

        <div className="swipe-area">
            <p className="home-eyebrow">
                WATCH TOGETHER · {session.participant.name}
            </p>

            <p className="group-game-progress">
                {Math.min(currentIndex + 1, session.order.length)} / {session.order.length}
            </p>

            {movie ? (
                <Fragment key={movie.id}>
                    <SwipeCard
                        key={movie.id}
                        movie={movie}
                        onChoice={update}
                        disabled={locked}
                    />

                    <div className="vote-buttons">
                        <button
                            onClick={() => update(false)}
                            className="no"
                            aria-label="Dislike"
                            disabled={locked}
                        >
                            <HeartCrack size={64} />
                        </button>

                        <button
                            onClick={() => update(true)}
                            className="yes"
                            aria-label="Like"
                            disabled={locked}
                        >
                            <Heart size={64} />
                        </button>
                    </div>
                </Fragment>
            ) : (
                <p className="home-eyebrow">
                    No more movies available.
                </p>
            )}

            {session.votes.length > 0 && (
                <div className="bottom-actions">
                    <button onClick={undo} disabled={locked}>
                        <RotateCcw size={17} />
                        Undo
                    </button>
                </div>
            )}
        </div>
    </main>
);
}

export { GroupGamePage };
            