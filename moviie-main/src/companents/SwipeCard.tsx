import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { Poster } from "./Poster";
import { type Movie } from "../modul";
import { useRef } from "react";

function SwipeCard({
movie,
onChoice,
disabled
}: {
movie: Movie;
onChoice: (liked: boolean) => void;
disabled: boolean;
}) {
const x = useMotionValue(0);
const rotate = useTransform(x, [-220, 220], [-12, 12]);
const yes = useTransform(x, [0, 110], [0, 1]);
const no = useTransform(x, [-110, 0], [1, 0]);
const busy = useRef(false);
function choose(liked: boolean) {
   if (busy.current || disabled) return;

   busy.current = true;

   animate(x, liked ? 550 : -550, {
       duration: 0.28
   }).then(() => onChoice(liked));
}

return (
   <motion.div
       className="swipe-card"
       style={{ x, rotate }}
       drag={disabled ? false : "x"}
       dragConstraints={{ left: 0, right: 0 }}
       dragElastic={0.95}
       onDragEnd={(_e, info) => {
           if (
               Math.abs(info.offset.x) > 95 ||
               Math.abs(info.velocity.x) > 650
           ) {
               choose(info.offset.x > 0);
           } else {
               animate(x, 0, {
                   type: "spring",
                   stiffness: 300,
                   damping: 22
               });
           }
       }}
   >
       <div className="swipe-card-poster">
           <Poster movie={movie} showFavouriteButton={false} />
       </div>

       <div className="card-shade" />

       <span className="card-label">
           MOVIIES SELECTION
       </span>

       <motion.span
           className="vote-stamp vote-stamp--yes"
           style={{ opacity: yes }}
       >
           LIKE
       </motion.span>

       <motion.span
           className="vote-stamp vote-stamp--no"
           style={{ opacity: no }}
       >
           NOPE
       </motion.span>

       <div className="card-meta">
           <strong>{movie.title}</strong>

           <small>
               {movie.year} · {movie.genre}
           </small>
       </div>
   </motion.div>
);
}

export { SwipeCard };