import { Link, useLocation } from "react-router-dom";
import {
    House,
    Compass,
    Heart,
    Clapperboard,
} from "lucide-react";

function DesktopSidebar() {
    const location = useLocation();

    const isHome =
        location.pathname === "/" && !location.hash;
    const isDiscover =
        location.pathname === "/" && location.hash === "#discover";
    const isFavourites = location.pathname === "/favourites";
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
    const isChoice = choicePaths.includes(location.pathname);

    return (
        <aside className="desktop-sidebar">
            <Link to="/" className="desktop-sidebar-logo" aria-label="MOVIIES home">
                <span className="desktop-sidebar-wordmark">moviies<span>.</span></span>
                <span className="desktop-sidebar-mark">m</span>
            </Link>

            <p className="desktop-sidebar-caption">YOUR CINEMA SPACE</p>

            <nav className="desktop-sidebar-nav" aria-label="Main navigation">
                <Link to="/" className={isHome ? "active" : ""}>
                    <House size={19} strokeWidth={1.8} />
                    <span>Home</span>
                </Link>

                <Link to="/#discover" className={isDiscover ? "active" : ""}>
                    <Compass size={19} strokeWidth={1.8} />
                    <span>Discover</span>
                </Link>

                <Link to="/favourites" className={isFavourites ? "active" : ""}>
                    <Heart size={19} strokeWidth={1.8} />
                    <span>Favourites</span>
                </Link>

                <Link to="/the-choice" className={isChoice ? "active" : ""}>
                    <Clapperboard size={19} strokeWidth={1.8} />
                    <span>The Choice</span>
                </Link>
            </nav>

            <div className="desktop-sidebar-bottom">
                <span className="desktop-sidebar-dot" />
                <span>Every movie has a feeling.</span>
            </div>
        </aside>
    );
}

export { DesktopSidebar };
