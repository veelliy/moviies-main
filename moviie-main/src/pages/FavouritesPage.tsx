import { Link } from "react-router-dom";
import { Intro } from "../companents/Intro";

function FavouritesPage() {
return (
     <Intro>
        <main className="favourites-page">
            <header className="favourites-header">
                <Link to="/" className="favourites-logo">
                  moviies
                </Link>
                <nav className="favourites-nav">
                    <Link to="/">Discover</Link>
                    <Link to="/favourites">Favourites</Link>
                    <Link to="/watch-together">
                        Watch Together
                    </Link>
                </nav>
            </header>

            <section className="favourites-hero">
                <p className="favourites-eyebrow">
                    YOUR PERSONAL COLLECTION
                </p>

                <h1>Your favourite movies.</h1>

                <p>
                    All the films you love, collected
                    in one place.
                </p>
            </section>

            <section className="favourites-content">
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
            </section>
        </main>
    </Intro>
);
}
export { FavouritesPage };