import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "../../pages/HomePage";
import { GamePage } from "../../pages/GamePages";
import { JoinPage } from "../../pages/JoinPage";
import { ResultPage } from "../../pages/ResultPage";
import { SharePage } from "../../pages/SharePage";
import { WatchTogetherPage } from "../../pages/WatchTogether";
import { FavouritesPage } from "../../pages/FavouritesPage";
const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage /> ,
    },
     {
        path: "/share",
        element: <SharePage/> ,
    },
     {
        path: "/game",
        element: <GamePage/>
    },
     {
        path: "/result",
        element: <ResultPage /> ,
    },
    {
        path: "/join",
        element: <JoinPage/>, 
    },
    {
        path: "/watch-together",
        element: <WatchTogetherPage />
    },
    {
        path: "/favourites",
        element: <FavouritesPage />
    }
]);

function AppRouter() {
    return <RouterProvider router={router} />; 
} 

export {AppRouter};

