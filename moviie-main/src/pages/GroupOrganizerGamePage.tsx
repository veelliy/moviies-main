import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
        !group.organizer?.id
    ) {
        return null;
    }

    group.organizerOrder =
        Array.isArray(group.organizerOrder) &&
        group.organizerOrder.length === group.invitation.movieIds.length
            ? group.organizerOrder
            : shuffle([...group.invitation.movieIds]);

    group.organizerVotes = Array.isArray(group.organizerVotes)
        ? group.organizerVotes
        : [];

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

useEffect(() => {
    if (!group) {
        navigate("/watch-together-setup", { replace: true });
        return;
    }

    if (
        group.organizerVotes &&
        group.organizerOrder &&
        group.organizerVotes.length === group.organizerOrder.length
    ) {
        navigate("/group-share", { replace: true });
    }
}, [group, navigate]);

if (!group || !group.organizerOrder || !group.organizerVotes) {
    return null;
}

const currentId = group.organizerOrder[group.organizerVotes.length];
const movie = movies.find((item) => item.id === currentId);

const update = (liked: boolean) => {
    if (locked || !movie) return;

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
        window.alert("Could not save your vote. Please try again.");
    }

    setLocked(false);
};

const undo = () => {
    if (!group.organizerVotes!.length || locked) return;

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
        window.alert("Could not update your votes. Please try again.");
    }
};

return (
    <main className="workspace">
        <Header />

        <div className="swipe-area">
            <p className="home-eyebrow">
                GROUP VOTING · {group.organizer.name}
            </p>
            <p className="group-game-progress">
                {Math.min(
                    group.organizerVotes.length + 1,
                    group.organizerOrder.length
                )} / {group.organizerOrder.length}
            </p>

            {movie && (
                <Fragment key={movie.id}>
                    <SwipeCard
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
            )}

            {group.organizerVotes.length > 0 && (
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

export { GroupOrganizerGamePage };