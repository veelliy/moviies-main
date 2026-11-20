import data from "./data.json";

export type Movie = {
   id: string;
   title: string;
   year: number;
   genre: string;
   poster: string;
};
export type Invitation = {
    v: 1;
    dataset: "movies-v1";
    name: string;
    likes: string[];
};
export type Vote = { id: string; liked: boolean };
export type Session = {
   v: 1;
   dataset: "movies-v1";
   name: string;
   order: string[];
   votes: Vote[];
   first?: { name: string; likes: string[] };
   role: 1 | 2;
};

export const movies: Movie[] = data;
// ================================
// FAVOURITES
// ================================

const FAVOURITES_KEY = "moviies:favourites:v1";

// Get all favourite movie IDs
export const getFavourites = (): string[] => {
try {
const saved = localStorage.getItem(FAVOURITES_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
        (id): id is string =>
            typeof id === "string" &&
            movieIds.has(id)
    );
} catch {
    return [];
}
};

// Save favourite movie IDs
export const saveFavourites = (ids: string[]) => {
const validIds = [...new Set(ids)].filter(
(id) => movieIds.has(id)
);

localStorage.setItem(
    FAVOURITES_KEY,
    JSON.stringify(validIds)
);
};

// Add a movie to favourites
export const addFavourite = (id: string) => {
const current = getFavourites();

if (!movieIds.has(id) || current.includes(id)) return;

saveFavourites([...current, id]);
};

// Remove a movie from favourites
export const removeFavourite = (id: string) => {
saveFavourites(
getFavourites().filter((movieId) => movieId !== id)
);
};

// Check whether a movie is a favourite
export const isFavourite = (id: string): boolean => {
return getFavourites().includes(id);
};
export const movieIds = new Set(movies.map((m) => m.id));
// ================================
// CHOICE — AVAILABLE MOVIES
// ================================

export const getFavouriteMovies = (): Movie[] => {
const favouriteIds = new Set(getFavourites());
return movies.filter((movie) =>
   favouriteIds.has(movie.id)
);
};
const KEY = "swipey:session:v1";

export const getName = () => {
   try {
      return localStorage.getItem("name") || "";
   } catch {
      return "";
   }
};
export const setName = (name: string) => localStorage.setItem("name", name);
export const shuffle = <T>(values: T[]): T[] => {
   const copy = [...values];
   for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
   }
   return copy;
};
export const freshSession = (
   name: string,
   first?: Session["first"],
): Session => ({
   v: 1,
   dataset: "movies-v1",
   name,
   order: shuffle([...movieIds]),
   votes: [],
   first,
   role: first ? 2 : 1,
});
export const saveSession = (s: Session) => {
   localStorage.setItem(KEY, JSON.stringify(s));
};
export const readSession = (): Session | null => {
   try {
       return JSON.parse(localStorage.getItem(KEY) || "null");
   } catch {
      return null;
   }
};
export const clearSession = () => localStorage.removeItem(KEY);
export const createInvitation = (s: Session): Invitation => ({
   v: 1,
   dataset: "movies-v1",
   name: s.name,
   likes: s.votes.filter((v) => v.liked).map((v) => v.id),
});
export const encodeInvitation = (inv: Invitation) => {
   const bytes = new TextEncoder().encode(JSON.stringify(inv));
   let binary = "";
   bytes.forEach((x) => (binary += String.fromCharCode(x)));
   return btoa(binary)
      .replaceAll("+", "-")
      .replaceAll("/", "_")
      .replace(/=+$/, "");
};
export const decodeInvitation = (encoded: string): Invitation | null => {
   try {
      if (encoded.length > 2048 || !/^[A-Za-z0-9_-]+$/.test(encoded)) return null;
      const base = encoded.replaceAll("-", "+").replaceAll("_", "/");
      const bytes = Uint8Array.from(atob(base), (c) => c.charCodeAt(0));
       return JSON.parse(new TextDecoder("utf-8", {fatal: true}).decode(bytes)) as Invitation;
   } catch {
      return null;
   }
};
export const matches = (first: string[], second: string[]) =>
   second.filter((id) => first.includes(id));