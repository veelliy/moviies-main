import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { GradientBackground } from "./GradientBackground";

function Intro({ children }: { children: ReactNode }) {
return (
<main className="intro">
<GradientBackground />
<div className="intro__content">
            {children}
        </div>

        <footer className="intro__footer">
            <Link to="/the-choice" className="intro__choice-button">
                Choose what you want to watch
                <span>→</span>
            </Link>
        </footer>
    </main>
);
}

export { Intro };