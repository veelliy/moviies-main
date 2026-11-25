import { Fragment, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

        const validMovieIds = session.movieIds.filter(
            (id: unknown): id is string =>
                typeof id === "string" &&
                movies.some((movie) => movie.id === id)
        );

        if (validMovieIds.length === 0) return null;

        const savedOrder = Array.isArray(session.order)
            ? session.order.filter(
                (id: unknown): id is string =>
                    typeof id === "string" && validMovieIds.includes(id)
            )
            : [];

        const order =
            savedOrder.length === validMovieIds.length
                ? savedOrder
                : shuffle([...validMovieIds]);

        const updatedSession: GroupParticipantSession = {
            ...session,
            movieIds: validMovieIds,
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
    const actionLock = useRef(false);

    useEffect(() => {
        if (!session) {
            navigate("/group-join", { replace: true });
            return;
        }

        actionLock.current = false;
        setLocked(false);

        if (session.votes.length >= session.order.length) {
            navigate("/group-submit", { replace: true });
        }
    }, [session, navigate]);

    if (!session) return null;

    const currentIndex = session.votes.length;
    const totalMovies = session.order.length;
    const currentId = session.order[currentIndex];
    const movie = movies.find((item) => item.id === currentId);
    const progress = totalMovies > 0
        ? Math.min((currentIndex / totalMovies) * 100, 100)
        : 0;

    const update = (liked: boolean) => {
        if (actionLock.current || locked || !movie) return;

        actionLock.current = true;
        setLocked(true);

        const next: GroupParticipantSession = {
            ...session,
            votes: [
                ...session.votes,
                { id: movie.id, liked },
            ],
            likedIds: liked
                ? [...session.likedIds.filter((id) => id !== movie.id), movie.id]
                : session.likedIds.filter((id) => id !== movie.id),
            dislikedIds: !liked
                ? [...session.dislikedIds.filter((id) => id !== movie.id), movie.id]
                : session.dislikedIds.filter((id) => id !== movie.id),
        };

        try {
            localStorage.setItem(
                PARTICIPANT_STORAGE_KEY,
                JSON.stringify(next)
            );
            setSession(next);
        } catch {
            actionLock.current = false;
            setLocked(false);
            window.alert("Your vote could not be saved. Please try again.");
        }
    };

    const undo = () => {
        if (!session.votes.length || actionLock.current || locked) return;

        actionLock.current = true;
        setLocked(true);

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

        try {
            localStorage.setItem(
                PARTICIPANT_STORAGE_KEY,
                JSON.stringify(next)
            );
            setSession(next);
        } catch {
            actionLock.current = false;
            setLocked(false);
            window.alert("Your vote could not be updated. Please try again.");
        }
    };

    return (
        <main className="workspace voting-page">
            <Header />

            <section className="swipe-area">
                <div className="voting-heading">
                    <p className="home-eyebrow">WATCH TOGETHER</p>
                    <h1>{session.participant.name}'s turn</h1>
                    <p>Swipe right to like, left to pass.</p>
                </div>

                <div className="vote-progress" aria-label={`Movie ${Math.min(currentIndex + 1, totalMovies)} of ${totalMovies}`}>
                    <div className="vote-progress-topline">
                        <span>YOUR MOVIE SELECTION</span>
                        <strong>{Math.min(currentIndex + 1, totalMovies)} / {totalMovies}</strong>
                    </div>
                    <div className="vote-progress-track">
                        <span style={{ width: `${progress}%` }} />
                    </div>
                </div>

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
                                type="button"
                                onClick={() => update(false)}
                                className="vote-button vote-button--no"
                                aria-label="Dislike this movie"
                                disabled={locked}
                            >
                                <HeartCrack size={27} />
                                <span>Dislike</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => update(true)}
                                className="vote-button vote-button--yes"
                                aria-label="Like this movie"
                                disabled={locked}
                            >
                                <Heart size={27} />
                                <span>Like</span>
                            </button>
                        </div>
                    </Fragment>
                ) : (
                    <div className="voting-error">
                        <h2>We couldn't load this movie.</h2>
                        <p>Please return to the invitation and try again.</p>
                        <Link to="/the-choice">Back to The Choice</Link>
                    </div>
                )}

                {session.votes.length > 0 && (
                    <div className="bottom-actions">
                        <button type="button" onClick={undo} disabled={locked}>
                            <RotateCcw size={16} />
                            Undo last vote
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}

export { GroupGamePage };
