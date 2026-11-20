import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Intro } from "../companents/Intro";
import { Input } from "../companents/Input";
import { freshSession, saveSession } from "../modul";

function WatchTogetherSetup() {
const [name, setName] = useState("");
const nav = useNavigate();
const handleSaveName = () => {
    if (!name.trim()) return;

    localStorage.setItem("name", name.trim());
    saveSession(freshSession(name.trim()));

    nav("/game");
};

return (
    <Intro showChoiceButton={false}>
        <main className="main">
            <section className="main_content">
                <h1 className="main_title">
                    Watch Together
                </h1>

                <p className="main_description">
                    Find a movie you will both love.
                </p>

                <Input
                    value={name}
                    onChange={setName}
                    onClick={handleSaveName}
                />
            </section>
        </main>
    </Intro>
);
}

export { WatchTogetherSetup };