import { useState } from "react";
import type { Movie } from "../modul";
import {
addFavourite,
removeFavourite,
isFavourite
} from "../modul";

function Poster({
movie,
small = false
}: {
movie: Movie;
small?: boolean;
}) {
const [favourite, setFavourite] = useState(() =>
isFavourite(movie.id)
);
const toggleFavourite = () => {
   if (favourite) {
       removeFavourite(movie.id);
       setFavourite(false);
   } else {
       addFavourite(movie.id);
       setFavourite(true);
   }
};

return (
   <div className={`poster poster--${movie.id}${small ? " poster--small" : ""}`}>
       <div
           className="poster__image"
           style={
               movie.poster
                   ? { backgroundImage: `url(${movie.poster})` }
                   : {}
           }
       >
           {!movie.poster && (
               <div className="poster__fallback">
                   <span className="poster__shape">✦</span>
                   <strong>{movie.title}</strong>
                   <small>
                       {movie.year} · {movie.genre}
                   </small>
               </div>
           )}

           <button
               type="button"
               className={`poster-favourite ${favourite ? "active" : ""}`}
               onClick={toggleFavourite}
               aria-label={favourite ? "Remove from favourites" : "Add to favourites"}
           >
               {favourite ? "♥️" : "♡"}
           </button>
       </div>
   </div>
);
}

export { Poster };