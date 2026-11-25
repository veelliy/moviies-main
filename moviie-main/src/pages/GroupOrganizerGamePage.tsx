import { Fragment, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, HeartCrack, RotateCcw } from "lucide-react";
import { Header } from "../companents/Header";
import { SwipeCard } from "../companents/SwipeCard";
import { movies, shuffle } from "../modul";

const GROUP_STORAGE_KEY = "moviies:group-session:v2";

type GroupSession = {
    invitation: {
        groupId: string;
        movieIds: string[];
    };
    organizer: {
        id: string;
        name: string;
        likedIds: string[];
        dislikedIds: string[];
    };
    organizerOrder?: string[];
    organizerVotes?: { id: string; liked: boolean }[];
    participants: { id: string; name: string }[];
    submissions?: unknown[];
};

function loadGroupSession(): GroupSession | null {
    try {
        const saved = localStorage.getItem(GROUP_STORAGE_KEY);
        if (!saved) return null;

        const group = JSON.parse(saved) as GroupSession;

        if (
            !group.invitation?.groupId ||
            !Array.isArray(group.invitation.movieIds) ||
            !group.organizer?.id ||
            !Array.isArray(group.participants)
        ) {
            return null;
        }

        const validMovieIds = group.invitation.movieIds.filter(
            (id) => typeof id === "string" &&
                movies.some((movie) => movie.id === id)
        );

        if (validMovieIds.length === 0) return null;

        const savedOrder = Array.isArray(group.organizerOrder)
            ? group.organizerOrder.filter((id) => validMovieIds.includes(id))
            : [];

        group.invitation.movieIds = validMovieIds;
        group.organizerOrder =
            savedOrder.length === validMovieIds.length
                ? savedOrder
                : shuffle([...validMovieIds]);

        group.organizerVotes = Array.isArray(group.organizerVotes)
            ? group.organizerVotes.filter((vote) =>
                validMovieIds.includes(vote.id) &&
                typeof vote.liked === "boolean"
            )
            : [];

        group.organizer.likedIds = Array.isArray(group.organizer.likedIds)
            ? group.organizer.likedIds
            : [];
        group.organizer.dislikedIds = Array.isArray(group.organizer.dislikedIds)
            ? group.organizer.dislikedIds
            : [];

        localStorage.setItem(GROUP_STORAGE_KEY, JSON.stringify(group));

        return group;
    } catch {
        return null;
    }
}

function GroupOrganizerGamePage() {
    const navigate = useNavigate();

    const [group, setGroup] = useState<GroupSession | null>(
        () => loadGroupSession()
    );
    const [locked, setLocked] = useState(false);
    const actionLock = useRef(false);

    useEffect(() => {
        if (!group) {
            navigate("/watch-together", { replace: true });
            return;
        }

        actionLock.current = false;
        setLocked(false);

        if (
            group.organizerVotes &&
            group.organizerOrder &&
            group.organizerVotes.length >= group.organizerOrder.length
        ) {
            navigate("/group-share", { replace: true });
        }
    }, [group, navigate]);

    if (!group || !group.organizerOrder || !group.organizerVotes) {
        return null;
    }

    const currentIndex = group.organizerVotes.length;
    const totalMovies = group.organizerOrder.length;
    const currentId = group.organizerOrder[currentIndex];
    const movie = movies.find((item) => item.id === currentId);
    const progress = totalMovies > 0
        ? Math.min((currentIndex / totalMovies) * 100, 100)
        : 0;

    const update = (liked: boolean) => {
        if (actionLock.current || locked || !movie) return;

        actionLock.current = true;
        setLocked(true);

        const nextVotes = [
            ...group.organizerVotes!,
            { id: movie.id, liked },
        ];

        const nextGroup: GroupSession = {
            ...group,
            organizerVotes: nextVotes,
            organizer: {
                ...group.organizer,
                likedIds: nextVotes
                    .filter((vote) => vote.liked)
                    .map((vote) => vote.id),
                dislikedIds: nextVotes
                    .filter((vote) => !vote.liked)
                    .map((vote) => vote.id),
            },
        };

        try {
            localStorage.setItem(
                GROUP_STORAGE_KEY,
                JSON.stringify(nextGroup)
            );
            setGroup(nextGroup);
        } catch {
            actionLock.current = false;
            setLocked(false);
            window.alert("Could not save your vote. Please try again.");
        }
    };

    const undo = () => {
        if (!group.organizerVotes!.length || actionLock.current || locked) return;

        actionLock.current = true;
        setLocked(true);

        const nextVotes = group.organizerVotes!.slice(0, -1);

        const nextGroup: GroupSession = {
            ...group,
            organizerVotes: nextVotes,
            organizer: {
                ...group.organizer,
                likedIds: nextVotes
                    .filter((vote) => vote.liked)
                    .map((vote) => vote.id),
                dislikedIds: nextVotes
                    .filter((vote) => !vote.liked)
                    .map((vote) => vote.id),
            },
        };

        try {
            localStorage.setItem(
                GROUP_STORAGE_KEY,
                JSON.stringify(nextGroup)
            );
            setGroup(nextGroup);
        } catch {
            actionLock.current = false;
            setLocked(false);
            window.alert("Could not update your votes. Please try again.");
        }
    };

    return (
        <main className="workspace voting-page">
            <Header />

            <section className="swipe-area">
                <div className="voting-heading">
                    <p className="home-eyebrow">WATCH TOGETHER · HOST</p>
                    <h1>{group.organizer.name}'s turn</h1>
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
                        <p>Please return to your group invitation.</p>
                        <Link to="/group-share">Back to your group</Link>
                    </div>
                )}

                {group.organizerVotes.length > 0 && (
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

export { GroupOrganizerGamePage };
