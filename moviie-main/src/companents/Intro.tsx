import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { GradientBackground } from "./GradientBackground";

function Intro({
children,
showChoiceButton = true
}: {
children: ReactNode;
showChoiceButton?: boolean;
}) {
return (
<main className="intro">
<GradientBackground />
<div className="intro__content">
            {children}
        </div>

        {showChoiceButton && (
            <footer className="intro__footer">
                <Link to="/the-choice" className="intro__choice-button">
                    Choose what you want to watch
                    <span className="choice-arrow">→</span>
                </Link>
            </footer>
        )}
    </main>
);
}

export { Intro };