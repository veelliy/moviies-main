import { Link } from "react-router-dom";
import { useState } from "react";
import { movies } from "../modul";
import { Intro } from "../companents/Intro";
import { Poster } from "../companents/Poster";

function HomePage() {
const [search, setSearch] = useState("");
const [activeGenre, setActiveGenre] = useState("All");
const genres = [
    "All",
    ...Array.from(new Set(movies.map((movie) => movie.genre))),
];

const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
        movie.title.toLowerCase().includes(search.toLowerCase()) ||
        movie.genre.toLowerCase().includes(search.toLowerCase());

    const matchesGenre =
        activeGenre === "All" || movie.genre === activeGenre;

    return matchesSearch && matchesGenre;
});

const featuredMovie = movies.find(
    (movie) => movie.title.toLowerCase() === "dune"
) ?? movies[0];

return (
    <Intro>
        <main className="home-page">
            <header className="home-header">
                <Link to="/" className="home-logo">
                    moviies
                </Link>

                <nav className="home-nav">
                    <Link to="/">Discover</Link>
                    <Link to="/favourites">Favourites</Link>
                    <Link to="/watch-together">Watch Together</Link>
                </nav>
            </header>

            <section className="home-hero">
                <div className="home-hero-content">
                    <p className="home-eyebrow">
                        YOUR PERSONAL MOVIE SPACE
                    </p>

                    <h1>
                        Find your next obsession.
                    </h1>

                    <p className="home-hero-description">
                        Cinema is a feeling. Discover stories
                        worth remembering.
                    </p>

                    <a href="#discover" className="home-explore-button">
                        Explore movies
                    </a>
                </div>
            </section>

            {featuredMovie && (
                <section className="home-featured">
                    <div>
                        <p className="home-eyebrow">
                            FEATURED MOVIE
                        </p>
                        <h2>{featuredMovie.title}</h2>
                        <p>
                            {featuredMovie.year} · {featuredMovie.genre}
                        </p>
                    </div>
                    <div className="home-featured-poster">
                        <Poster movie={featuredMovie} />
                    </div>
                </section>
            )}

            <section className="home-discover" id="discover">
                <div className="home-search-wrapper">
                    <input
                        className="home-search"
                        type="text"
                        placeholder="Search movies or genres..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="home-section-heading">
                    <div>
                        <p className="home-eyebrow">YOUR NEXT FILM</p>
                        <h2>Discover movies</h2>
                    </div>
                    <span>{filteredMovies.length} movies</span>
                </div>

                <div className="home-genres">
                    {genres.map((genre) => (
                        <button
                            key={genre}
                            className={`home-genre ${
                                activeGenre === genre ? "active" : ""
                            }`}
                            onClick={() => setActiveGenre(genre)}
                        >
                            {genre}
                        </button>
                    ))}
                </div>

                {filteredMovies.length > 0 ? (
                    <div className="home-movie-grid">
                        {filteredMovies.map((movie) => (
                            <article
                                className="home-movie-card"
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
                ) : (
                    <p className="home-empty">
                        No movies found.
                    </p>
                )}
            </section>

            <section className="home-watch">
                <div>
                    <p className="home-eyebrow">BETTER TOGETHER</p>
                    <h2>Some movies are better shared.</h2>
                    <p>
                        Find a movie you will both love.
                    </p>
                </div>

                <Link
                    to="/watch-together"
                    className="home-watch-button"
                >
                    Start Watch Together
                </Link>
            </section>

            <footer className="home-footer">
                <Link to="/">moviies</Link>
                <p>Every movie has a feeling.</p>
            </footer>

            <nav className="home-mobile-nav">
                <Link to="/" className="home-mobile-nav-item">
                    <span>⌂</span>
                    Home
                </Link>
                <a href="#discover" className="home-mobile-nav-item">
                    <span>⌕</span>
                    Discover
                </a>
                <Link to="/favourites" className="home-mobile-nav-item">
                    <span>♡</span>
                    Favourites
                </Link>
                <Link to="/watch-together" className="home-mobile-nav-item">
                    <span>＋</span>
                    Together
                </Link>
            </nav>
        </main>
    </Intro>
);
}

export { HomePage };