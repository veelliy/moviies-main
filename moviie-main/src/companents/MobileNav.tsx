import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

function MobileNav() {
    const location = useLocation();

    const choicePaths = [
        "/the-choice",
        "/choose-myself",
        "/watch-together",
        "/group-share",
        "/group-join",
        "/group-game",
        "/group-organizer-game",
        "/group-submit",
        "/group-import",
        "/group-results",
        "/personal-picks",
        "/share",
        "/game",
        "/result",
        "/join",
    ];

    const activeIndex =
        location.pathname === "/favourites" ? 2 :
        choicePaths.includes(location.pathname) ? 3 :
        location.pathname === "/" && location.hash === "#discover" ? 1 :
        0;

    useEffect(() => {
        if (location.pathname === "/" && location.hash === "#discover") {
            requestAnimationFrame(() => {
                document.getElementById("discover")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });
        }

        if (location.pathname === "/" && !location.hash) {
            requestAnimationFrame(() => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            });
        }
    }, [location.pathname, location.hash]);

    return (
        <nav
            className="home-mobile-nav"
            style={{
                "--active-index": activeIndex
            } as React.CSSProperties}
            aria-label="Main navigation"
        >
            <div className="home-mobile-nav-indicator" />

            <Link
                to="/"
                className={`home-mobile-nav-item ${activeIndex === 0 ? "active" : ""}`}
                onClick={() => {
                    if (location.pathname === "/") {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                }}
            >
                <span aria-hidden="true">⌂</span>
                Home
            </Link>

            <Link
                to="/#discover"
                className={`home-mobile-nav-item ${activeIndex === 1 ? "active" : ""}`}
            >
                <span aria-hidden="true">⌕</span>
                Discover
            </Link>

            <Link
                to="/favourites"
                className={`home-mobile-nav-item ${activeIndex === 2 ? "active" : ""}`}
            >
                <span aria-hidden="true">♡</span>
                Favourites
            </Link>

            <Link
                to="/the-choice"
                className={`home-mobile-nav-item ${activeIndex === 3 ? "active" : ""}`}
            >
                <span aria-hidden="true">◎</span>
                The Choice
            </Link>
        </nav>
    );
}

export { MobileNav };
