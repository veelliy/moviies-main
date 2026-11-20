import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

function MobileNav() {
const location = useLocation();
const activeIndex =
    location.pathname === "/favourites" ? 2 :
    location.pathname === "/the-choice" ? 3 :
    location.hash === "#discover" ? 1 :
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
    >
        <div className="home-mobile-nav-indicator" />

        <Link
            to="/"
            className={`home-mobile-nav-item ${activeIndex === 0 ? "active" : ""}`}
            onClick={() => {
                if (location.pathname === "/") {
                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });
                }
            }}
        >
            <span>⌂</span>
            Home
        </Link>

        <Link
            to="/#discover"
            className={`home-mobile-nav-item ${activeIndex === 1 ? "active" : ""}`}
            onClick={() => {
                if (location.pathname === "/" && location.hash === "#discover") {
                    document.getElementById("discover")?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }}
        >
            <span>⌕</span>
            Discover
        </Link>

        <Link
            to="/favourites"
            className={`home-mobile-nav-item ${activeIndex === 2 ? "active" : ""}`}
        >
            <span>♡</span>
            Favourites
        </Link>

        <Link
            to="/the-choice"
            className={`home-mobile-nav-item ${activeIndex === 3 ? "active" : ""}`}
        >
            <span>◎</span>
            The Choice
        </Link>
    </nav>
);
}

export { MobileNav };