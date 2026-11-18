import "./App.css";
import { AppRouter } from "./app/router/router";
import { GradientBackground } from "./companents/GradientBackground";

function App() {
    return (
        <>
            <GradientBackground />
            <AppRouter />
        </>
    );
}

export default App;
