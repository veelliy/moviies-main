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
import {ChooseMyself } from "../../pages/ChooseMyself";
import { PersonalPicks } from "../../pages/PersonalPicks";
import { GroupSharePage } from "../../pages/GroupSharePage";
import { GroupJoinPage } from "../../pages/GroupJoinPage";
import { GroupGamePage } from "../../pages/GroupGamePage";
import { GroupSubmitPage } from "../../pages/GroupSubmitPage";
import { GroupImportPage } from "../../pages/GroupImportPage";
import { GroupOrganizerGamePage } from "../../pages/GroupOrganizerGamePage";
import { GroupResultsPage } from "../../pages/GroupResultPage";

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
                path: "/personal-picks",
                element: <PersonalPicks />,
            },
            {
                path: "/choose-myself",
                element: <ChooseMyself />,
            },
            {
                path: "/watch-together",
                element: <WatchTogetherSetup />,
            },
            {
                path: "/group-share",
                element: <GroupSharePage />,
            },
            { 
                path: "/group-join", 
                element: <GroupJoinPage />
             },
            {
                path: "/group-game",
                element: <GroupGamePage />,
            },
            {
                path: "/group-organizer-game",
                element: <GroupOrganizerGamePage />,
            },
            {
                path: "/group-submit",
                element: <GroupSubmitPage />
            },
            {
                path: "/group-import",
                element: <GroupImportPage />
            },
            {
                path: "/group-results",
                element: <GroupResultsPage />
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