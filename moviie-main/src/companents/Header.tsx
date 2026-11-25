import { UserRound } from "lucide-react";
import { getName } from "../modul";

function Header() {
    let displayName = getName();

    try {
        const participant = localStorage.getItem("moviies:group-participant:v2");
        const group = localStorage.getItem("moviies:group-session:v2");

        if (participant) {
            const parsed = JSON.parse(participant);
            displayName = parsed.participant?.name || displayName;
        } else if (group) {
            const parsed = JSON.parse(group);
            displayName = parsed.organizer?.name || displayName;
        }
    } catch {
        // Keep the name from the legacy profile if stored group data is unavailable.
    }

    return (
        <header className="header">
            <div className="profile">
                <span title={displayName || "MOVIIES member"}>
                    {displayName || "MOVIIES member"}
                </span>
                <UserRound size={21} />
            </div>
        </header>
    );
}

export { Header };
