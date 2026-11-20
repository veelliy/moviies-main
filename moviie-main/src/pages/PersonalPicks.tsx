import { useState } from "react";
import { Link } from "react-router-dom";
import { Intro } from "../companents/Intro";
import { Poster } from "../companents/Poster";
import { movies, type Movie } from "../modul";

type PersonalResults = {
likedIds: string[];
dislikedIds: string[];
};

function PersonalPicks() {
const [results] = useState<PersonalResults>(() => {
try {
const saved = localStorage.getItem(
"moviies:personal-results:v1"
);
if (!saved) {
    return { likedIds: [], dislikedIds: [] };
}

const parsed = JSON.parse(saved);

return {
    likedIds: Array.isArray(parsed.likedIds)
        ? parsed.likedIds
        : [],
    dislikedIds: Array.isArray(parsed.dislikedIds)
        ? parsed.dislikedIds
        : [],
};
} catch {
return { likedIds: [], dislikedIds: [] };
}
});

const likedMovies = movies.filter((movie) =>
results.likedIds.includes(movie.id)
);

const dislikedMovies = movies.filter((movie) =>
results.dislikedIds.includes(movie.id)
);

const [randomMovie, setRandomMovie] = useState<Movie | null>(null);

const handleRandomMovie = () => {
if (likedMovies.length === 0) return;

const randomIndex = Math.floor(
Math.random() * likedMovies.length
);

setRandomMovie(likedMovies[randomIndex]);
};

return (
<Intro showChoiceButton={false}>
<main className="personal-picks-page">
    <header className="personal-picks-header">
        <Link to="/" className="choice-logo">
            moviies
        </Link>

        <Link to="/the-choice" className="personal-picks-back">
            The Choice
        </Link>
    </header>

    <section className="personal-picks-hero">
        <p className="home-eyebrow">
            YOUR PERSONAL COLLECTION
        </p>

        <h1>Personal Picks</h1>

        <p>
            The movies that caught your attention.
            Your next favourite might be here.
        </p>

        <span className="personal-picks-count">
            {likedMovies.length} liked · {dislikedMovies.length} disliked
        </span>
    </section>

    <section className="personal-picks-liked">
        <h2>Liked Movies</h2>

        {likedMovies.length > 0 ? (
            <>
                <section className="personal-picks-random">
                    <button
                        className="personal-picks-random-button"
                        onClick={handleRandomMovie}
                    >
                        Random Movie
                        <span>→</span>
                    </button>

                    {randomMovie && (
                        <div className="personal-picks-random-result">
                            <p className="home-eyebrow">
                                YOUR RANDOM PICK
                            </p>

                            <div className="personal-picks-random-poster">
                                <Poster movie={randomMovie} />
                            </div>

                            <h2>{randomMovie.title}</h2>

                            <p>
                                {randomMovie.year} · {randomMovie.genre}
                            </p>
                        </div>
                    )}
                </section>

                <div className="personal-picks-grid">
                    {likedMovies.map((movie) => (
                        <article
                            className="personal-picks-card"
                            key={movie.id}
                        >
                            <Poster movie={movie} />
                            <h3>{movie.title}</h3>
                                    <p>
                                        {movie.year} · {movie.genre}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="personal-picks-empty">
                        You haven't liked any movies yet.
                    </p>
                )}
            </section>

            {dislikedMovies.length > 0 && (
                <section className="personal-picks-disliked">
                    <h2>Disliked Movies</h2>

                    <div className="personal-picks-grid">
                        {dislikedMovies.map((movie) => (
                            <article
                                className="personal-picks-card"
                                key={movie.id}
                            >
                                <Poster movie={movie} />
                                <h3>{movie.title}</h3>
                                <p>
                                    {movie.year} · {movie.genre}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            <footer className="personal-picks-footer">
                <Link to="/choose-myself">
                    Choose again
                </Link>

                <Link to="/">
                    Back to Discover
                </Link>
            </footer>
        </main>
    </Intro>
);
}

export { PersonalPicks };