import { useState } from "react";
import { Link } from "react-router-dom";
import { Intro } from "../companents/Intro";
import { Poster } from "../companents/Poster";
import {
movies,
getFavourites,
removeFavourite
} from "../modul";

function FavouritesPage() {
const [favouriteIds, setFavouriteIds] = useState<string[]>(
() => getFavourites()
);
const favouriteMovies = movies.filter((movie) =>
    favouriteIds.includes(movie.id)
);

const handleRemove = (id: string) => {
    removeFavourite(id);
    setFavouriteIds((current) =>
        current.filter((movieId) => movieId !== id)
    );
};

return (
    <Intro showChoiceButton={false}>
        <main className="favourites-page">
            <header className="favourites-header">
                <Link to="/" className="favourites-logo">
                    moviies
                </Link>

                <nav className="favourites-nav">
                    <Link to="/">Discover</Link>
                    <Link to="/favourites">Favourites</Link>
                    <Link to="/the-choice">The Choice</Link>
                </nav>
            </header>

            <section className="favourites-hero">
                <div className="favourites-hero-text">
                <p className="favourites-eyebrow">
                    YOUR PERSONAL COLLECTION
                </p>

                <h1>Your favourite movies.</h1>

                <p>
                    All the films you love, collected
                    in one place.
                </p>
                </div>

                <Link 
                    to="/the-choice"
                    className="intro__choice-button favourites-choice-button"
                >
                    Choose what you want to watch
                    <span>→</span>
                </Link>
            </section>

            <section className="favourites-content">
                {favouriteMovies.length > 0 ? (
                    <div className="home-movie-grid">
                        {favouriteMovies.map((movie) => (
                            <article
                                className="home-movie-card"
                                key={movie.id}
                            >
                                <Poster movie={movie} />

                                <h3>{movie.title}</h3>

                                <p>
                                    {movie.year} · {movie.genre}
                                </p>

                                <button
                                    className="favourites-remove"
                                    onClick={() => handleRemove(movie.id)}
                                    type="button"
                                >
                                    Remove from favourites
                                </button>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="favourites-empty">
                        <span className="favourites-symbol">♡</span>

                        <h2>Your collection starts here.</h2>

                        <p>
                            Save the movies you love and
                            come back to them whenever you want.
                        </p>

                        <Link
                            to="/"
                            className="favourites-explore"
                        >
                            Explore movies
                        </Link>
                    </div>
                )}
            </section>
        </main>
    </Intro>
);
}

export { FavouritesPage };