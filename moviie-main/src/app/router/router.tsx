import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "../../pages/HomePage";
import { GamePage } from "../../pages/GamePages";
import { JoinPage } from "../../pages/JoinPage";
import { ResultPage } from "../../pages/ResultPage";
import { SharePage } from "../../pages/SharePage";
import { WatchTogetherPage } from "../../pages/WatchTogether";
import { FavouritesPage } from "../../pages/FavouritesPage";
import { MainLayout } from "../../companents/MainLayout";
import {WatchTogetherSetup} from "../../pages/WatchTogetherSetup";

const router = createBrowserRouter([
    {
        element: <MainLayout />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/favourites",
                element: <FavouritesPage />,
            },
            {
                path: "/the-choice",
                element: <WatchTogetherPage />,
            },
            {
                path: "/watch-together-setup",
                element: <WatchTogetherSetup />,
            },
        ],
    },
    {
        path: "/share",
        element: <SharePage />,
    },
    {
        path: "/game",
        element: <GamePage />,
    },
    {
        path: "/result",
        element: <ResultPage />,
    },
    {
        path: "/join",
        element: <JoinPage />,
    },
]);

function AppRouter() {
    return <RouterProvider router={router} />;
}

export { AppRouter };