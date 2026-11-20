import { Link } from "react-router-dom";
import { Intro } from "../companents/Intro";

function WatchTogetherPage() {
return (
<Intro showChoiceButton={false}>
<main className="choice-page">
<header className="choice-header">
<Link to="/" className="choice-logo">
moviies
</Link>
</header>
<section className="choice-hero">
                <p className="home-eyebrow">
                    YOUR MOVIE NIGHT STARTS HERE
                </p>

                <h1>The Choice</h1>

                <p>
                    Find the perfect movie for your next movie night.
                    Alone or together — the choice is yours.
                </p>
            </section>

            <section className="choice-options">
                <Link
                    to="/choose-myself"
                    className="choice-card choice-card-solo"
                >
                    <div className="choice-card-image choice-card-image-solo" />
                    <span className="choice-card-number">01</span>

                    <div>
                        <p className="home-eyebrow">
                            JUST FOR YOU
                        </p>
                        <h2>Choose for Myself</h2>
                        <p>
                            Discover movies you love and find
                            your next favourite.
                        </p>
                    </div>

                    <span className="choice-card-arrow">→</span>
                </Link>

                <Link
                    to="/watch-together"
                    className="choice-card choice-card-group"
                >
                    <div className="choice-card-image choice-card-image-group" />
                    <span className="choice-card-number">02</span>

                    <div>
                        <p className="home-eyebrow">
                            SHARE THE EXPERIENCE
                        </p>
                        <h2>Watch Together</h2>
                        <p>
                            Bring 2–6 people together and find
                            a movie everyone will enjoy.
                        </p>
                    </div>

                    <span className="choice-card-arrow">→</span>
                </Link>
            </section>
        </main>
    </Intro>
);
}

export { WatchTogetherPage };