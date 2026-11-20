import { useState } from "react";
import { Link } from "react-router-dom";
import { Intro } from "../companents/Intro";
import { Poster } from "../companents/Poster";
import { getFavouriteMovies } from "../modul";

function ChooseMyself() {
const [favouriteMovies] = useState(() => getFavouriteMovies());
const [currentIndex, setCurrentIndex] = useState(0);
const [likedIds, setLikedIds] = useState<string[]>([]);
const [dislikedIds, setDislikedIds] = useState<string[]>([]);
const [finished, setFinished] = useState(false);

const currentMovie = favouriteMovies[currentIndex];

const handleVote = (liked: boolean) => {
    if (!currentMovie) return;
    const nextLikedIds = liked
    ? [...likedIds, currentMovie.id]
    : likedIds;

const nextDislikedIds = liked
    ? dislikedIds
    : [...dislikedIds, currentMovie.id];

setLikedIds(nextLikedIds);
setDislikedIds(nextDislikedIds);

localStorage.setItem(
    "moviies:personal-results:v1",
    JSON.stringify({
        likedIds: nextLikedIds,
        dislikedIds: nextDislikedIds,
    })
);

if (currentIndex + 1 >= favouriteMovies.length) {
    setFinished(true);
} else {
    setCurrentIndex((current) => current + 1);
}
};

if (favouriteMovies.length === 0) {
    return (
        <Intro showChoiceButton={false}>
            <main className="choice-mode-page">
                <section className="choice-mode-empty">
                    <p className="home-eyebrow">
                        YOUR PERSONAL MOVIE NIGHT
                    </p>

                    <h1>Your collection is waiting.</h1>

                    <p>
                        Add some movies to your Favourites
                        before starting your personal selection.
                    </p>

                    <Link to="/favourites" className="choice-mode-button">
                        Explore your Favourites
                    </Link>

                    <Link to="/" className="choice-mode-back">
                        Back to Discover
                    </Link>
                </section>
            </main>
        </Intro>
    );
}

if (finished) {
    return (
    <Intro showChoiceButton={false}>
    <main className="choice-mode-page">
    <section className="choice-mode-empty">
    <p className="home-eyebrow">
    YOUR SELECTION IS COMPLETE
    </p>
    <h1>You've made your choice.</h1>

                <p>
                    You liked {likedIds.length} movies
                    and disliked {dislikedIds.length}.
                </p>

                <Link
                    to="/personal-picks"
                    className="choice-mode-button"
                >
                    Explore Personal Picks
                </Link>

                <button
                    className="choice-mode-button"
                    onClick={() => {
                        localStorage.removeItem(
                            "moviies:personal-results:v1"
                        );

                        setCurrentIndex(0);
                        setLikedIds([]);
                        setDislikedIds([]);
                        setFinished(false);
                    }}
                >
                    Start again
                </button>
            </section>
        </main>
    </Intro>
);
}

return (
    <Intro showChoiceButton={false}>
        <main className="choice-mode-page">
            <header className="choice-mode-header">
                <Link to="/the-choice" className="choice-logo">
                    moviies
                </Link>

                <span>
                    {currentIndex + 1} / {favouriteMovies.length}
                </span>
            </header>

            <section className="choice-mode-content">
                <p className="home-eyebrow">
                    CHOOSE FOR MYSELF
                </p>

                <h1>Would you watch this?</h1>

                <div className="choice-mode-poster">
                    <Poster movie={currentMovie} />
                </div>

                <h2>{currentMovie.title}</h2>

                <p className="choice-mode-movie-info">
                    {currentMovie.year} · {currentMovie.genre}
                </p>

                <div className="choice-mode-actions">
                    <button
                        className="choice-mode-dislike"
                        onClick={() => handleVote(false)}
                    >
                        Dislike
                        </button>

                    <button
                        className="choice-mode-like"
                        onClick={() => handleVote(true)}
                    >
                        Like
                    </button>
                </div>
            </section>
        </main>
    </Intro>
);
}

export { ChooseMyself };