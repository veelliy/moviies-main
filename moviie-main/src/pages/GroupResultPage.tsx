import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../companents/Header";
import { Intro } from "../companents/Intro";
import { Poster } from "../companents/Poster";
import { movies, type Movie } from "../modul";

const GROUP_STORAGE_KEY = "moviies:group-session:v2";

type ParticipantResult = {
id: string;
name: string;
likedIds: string[];
dislikedIds: string[];
};

function GroupResultsPage() {
const navigate = useNavigate();
const [tab, setTab] = useState<
    "matches" | "statistics" | "participants"
>("matches");

const [selectedParticipant, setSelectedParticipant] =
    useState<string | null>(null);

const [randomMovie, setRandomMovie] = useState<Movie | null>(null);

let group: any = null;

try {
    const saved = localStorage.getItem(GROUP_STORAGE_KEY);
    group = saved ? JSON.parse(saved) : null;
} catch {
    group = null;
}

if (!group?.invitation || !group?.organizer || !group?.participants) {
    return (
        <Intro showChoiceButton={false}>
            <div className="center-block">
                <h2>Group results not found</h2>
                <button className="primary" onClick={() => navigate("/the-choice")}>
                    Back to The Choice
                </button>
            </div>
        </Intro>
    );
}

const submissions = Array.isArray(group.submissions)
    ? group.submissions
    : [];

const participants: ParticipantResult[] = [
    {
        id: group.organizer.id,
        name: group.organizer.name,
        likedIds: group.organizer.likedIds ?? [],
        dislikedIds: group.organizer.dislikedIds ?? [],
    },
    ...group.participants
        .filter(
            (participant: { id: string }) =>
                participant.id !== group.organizer.id
        )
        .map((participant: { id: string; name: string }) => {
            const submission = submissions.find(
                (item: any) =>
                    item.participant?.id === participant.id
            );

            return {
                id: participant.id,
                name: submission?.participant?.name ?? participant.name,
                likedIds: submission?.participant?.likedIds ?? [],
                dislikedIds: submission?.participant?.dislikedIds ?? [],
            };
        }),
];

const totalParticipants = group.participantCount ?? participants.length;
const threshold = Math.floor(totalParticipants / 2) + 1;

const movieIds: string[] = group.invitation.movieIds ?? [];

const organizerCompleted =
    (group.organizerVotes?.length ?? 0) === movieIds.length;

const completedCount = participants.filter(
    (participant) =>
        participant.id === group.organizer.id
            ? organizerCompleted
            : submissions.some(
                (item: any) => item.participant?.id === participant.id
            )
).length;

const allCompleted = completedCount === totalParticipants;

const commonIds = movieIds.filter((movieId) => {
    const likes = participants.filter((participant) =>
        participant.likedIds.includes(movieId)
    ).length;

    return likes >= threshold;
});

const commonMovies = movies.filter((movie) =>
    commonIds.includes(movie.id)
);

const likedCount = participants.reduce(
    (total, participant) => total + participant.likedIds.length,
    0
);

const dislikedCount = participants.reduce(
    (total, participant) => total + participant.dislikedIds.length,
    0
);

const selected = participants.find(
    (participant) => participant.id === selectedParticipant
);

const handleRandomMovie = () => {
    if (!commonMovies.length) return;

    const index = Math.floor(Math.random() * commonMovies.length);
    setRandomMovie(commonMovies[index]);
};

return (
    <main className="workspace group-results-page">
        <Header />

        <section className="group-results-content">
            <p className="home-eyebrow">
                YOUR GROUP MOVIE NIGHT
            </p>

            <h1>Group Results</h1>

            <p className="group-results-progress">
                {completedCount} of {totalParticipants} participants
                completed voting
            </p>

            {!allCompleted && (
                <div className="group-results-waiting">
                Waiting for the remaining participants to submit
                their votes. Matches will update as results arrive.
            </div>
        )}

        <nav className="group-results-tabs">
            <button
                className={tab === "matches" ? "active" : ""}
                onClick={() => {
                    setTab("matches");
                    setSelectedParticipant(null);
                    setRandomMovie(null);
                }}
            >
                Matches
            </button>

            <button
                className={tab === "statistics" ? "active" : ""}
                onClick={() => {
                    setTab("statistics");
                    setSelectedParticipant(null);
                    setRandomMovie(null);
                }}
            >
                Statistics
            </button>

            <button
                className={tab === "participants" ? "active" : ""}
                onClick={() => {
                    setTab("participants");
                    setSelectedParticipant(null);
                    setRandomMovie(null);
                }}
            >
                Participants
            </button>
        </nav>

        {tab === "matches" && (
            <section className="group-results-section">
                <h2>Movies everyone will love</h2>

                <p>
                    A movie becomes a match when at least {threshold}
                    {" "}of {totalParticipants} participants like it.
                </p>

                {randomMovie && (
                    <div className="group-random-result">
                        <h3>Your random movie</h3>
                        <Poster movie={randomMovie} />
                        <p>{randomMovie.title}</p>
                    </div>
                )}

                {commonMovies.length > 0 ? (
                    <>
                        <div className="movie-grid">
                            {commonMovies.map((movie) => (
                                <div key={movie.id}>
                                    <Poster movie={movie} small />
                                </div>
                            ))}
                        </div>

                        <button
                            className="primary"
                            onClick={handleRandomMovie}
                        >
                            Random Movie
                        </button>
                    </>
                ) : (
                    <div className="empty-state">
                        <h2>No matches yet</h2>
                        <p>
                            There are not enough shared likes yet.
                            Check again when more participants finish.
                        </p>
                    </div>
                )}
            </section>
        )}

        {tab === "statistics" && (
            <section className="group-results-section">
                <h2>Group Statistics</h2>

                <div className="group-statistics-grid">
                    <div>
                        <strong>{totalParticipants}</strong>
                        <span>Participants</span>
                    </div>

                    <div>
                        <strong>{completedCount}</strong>
                        <span>Completed</span>
                    </div>

                    <div>
                        <strong>{likedCount}</strong>
                        <span>Total likes</span>
                    </div>

                    <div>
                        <strong>{dislikedCount}</strong>
                        <span>Total dislikes</span>
                        </div>

                        <div>
                            <strong>{commonMovies.length}</strong>
                            <span>Group matches</span>
                        </div>
                    </div>
                </section>
            )}

            {tab === "participants" && (
                <section className="group-results-section">
                    <h2>Participants</h2>

                    {selected ? (
                        <>
                            <button
                                className="text-button"
                                onClick={() => setSelectedParticipant(null)}
                            >
                                ← Back to participants
                            </button>

                            <h3>{selected.name}</h3>

                            <h4>Liked</h4>
                            {selected.likedIds.length > 0 ? (
                                <div className="movie-grid">
                                    {movies
                                        .filter((movie) =>
                                            selected.likedIds.includes(movie.id)
                                        )
                                        .map((movie) => (
                                            <div key={movie.id}>
                                                <Poster movie={movie} small />
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p>No liked movies.</p>
                            )}

                            <h4>Disliked</h4>
                            {selected.dislikedIds.length > 0 ? (
                                <div className="movie-grid">
                                    {movies
                                        .filter((movie) =>
                                            selected.dislikedIds.includes(movie.id)
                                        )
                                        .map((movie) => (
                                            <div key={movie.id}>
                                                <Poster movie={movie} small />
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p>No disliked movies.</p>
                            )}
                        </>
                    ) : (
                        <div className="group-participants-list">
                            {participants.map((participant) => {
                                const completed =
                                participant.id === group.organizer.id
                                    ? organizerCompleted
                                    : submissions.some(
                                        (item: any) =>
                                            item.participant?.id === participant.id
                                    );

                                return (
                                    <button
                                        key={participant.id}
                                        className="group-participant-item"
                                        onClick={() =>
                                            setSelectedParticipant(participant.id)
                                        }
                                    >
                                        <span>{participant.name}</span>
                                        <span>
                                            {completed ? "Completed" : "Waiting"}
                                        </span>
                                        <span>→</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </section>
                )}
                </section>
            </main>
        );
        }
        
        export { GroupResultsPage };