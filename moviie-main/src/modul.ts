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

// ================================
// WATCH TOGETHER — GROUP SYSTEM
// ================================

export type ParticipantResult = {
    id: string;
    name: string;
    likedIds: string[];
    dislikedIds: string[];
};

export type GroupInvitation = {
    v: 2;
    type: "group-invitation";
    groupId: string;
    dataset: "movies-v1";
    movieIds: string[];
    participants: {
        id: string;
        name: string;
    }[];
};

export type ParticipantInvitation = {
    v: 2;
    type: "participant-invitation";
    groupId: string;
    dataset: "movies-v1";
    movieIds: string[];
    participant: {
        id: string;
        name: string;
    };
};

export type ParticipantSubmission = {
    v: 2;
    type: "participant-submission";
    groupId: string;
    dataset: "movies-v1";
    participant: ParticipantResult;
};

export type GroupResults = {
    v: 2;
    type: "group-results";
    groupId: string;
    dataset: "movies-v1";
    movieIds: string[];
    participants: ParticipantResult[];
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

export const GROUP_MIN_PARTICIPANTS = 2;
export const GROUP_MAX_PARTICIPANTS = 6

// ================================
// WATCH TOGETHER — GROUP HELPERS
// ================================

export const createGroupId = (): string => {
return crypto.randomUUID();
};

export const createParticipantId = (): string => {
return crypto.randomUUID();
};

// Check movie IDs against the existing movie collection
export const validateMovieIds = (ids: unknown): string[] => {
if (!Array.isArray(ids)) return [];
return [...new Set(
   ids.filter(
       (id): id is string =>
           typeof id === "string" && movieIds.has(id)
   )
)];
};

// Check participant results
export const validateParticipantResult = (
value: unknown
): ParticipantResult | null => {
if (!value || typeof value !== "object") return null;
const participant = value as Record<string, unknown>;

if (
    typeof participant.id !== "string" ||
    typeof participant.name !== "string" ||
    !participant.name.trim() ||
    !Array.isArray(participant.likedIds) ||
    !Array.isArray(participant.dislikedIds)
) {
    return null;
}

const likedIds = validateMovieIds(participant.likedIds);
const dislikedIds = validateMovieIds(participant.dislikedIds)
    .filter((id) => !likedIds.includes(id));

return {
    id: participant.id,
    name: participant.name.trim().slice(0, 30),
    likedIds,
    dislikedIds,
};
};

// Calculate the number of votes needed for a group match
export const getMajorityThreshold = (participantCount: number): number => {
return Math.floor(participantCount / 2) + 1;
};

// Find movies liked by more than half of the participants
export const getGroupMatches = (
participants: ParticipantResult[],
availableMovieIds: string[]
): string[] => {
if (
participants.length < GROUP_MIN_PARTICIPANTS ||
participants.length > GROUP_MAX_PARTICIPANTS
) {
return [];
}
const threshold = getMajorityThreshold(participants.length);

return availableMovieIds.filter((movieId) => {
    const likes = participants.filter((participant) =>
        participant.likedIds.includes(movieId)
    ).length;

    return likes >= threshold;
});
};

// Encode group data into a shareable URL-safe string
export const encodeGroupData = (
data:
| GroupInvitation
| ParticipantInvitation
| ParticipantSubmission
| GroupResults
): string => {
const bytes = new TextEncoder().encode(JSON.stringify(data));
let binary = "";

bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
});

return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/, "");
};

// Decode group data safely
export const decodeGroupData = (encoded: string): unknown | null => {
try {
if (
encoded.length > 12000 ||
!/^[A-Za-z0-9_-]+$/.test(encoded)
) {
return null;
}
const base = encoded.replaceAll("-", "+").replaceAll("_", "/");
    const padded = base + "=".repeat((4 - (base.length % 4)) % 4);

    const bytes = Uint8Array.from(atob(padded), (char) =>
        char.charCodeAt(0)
    );

    return JSON.parse(
        new TextDecoder("utf-8", { fatal: true }).decode(bytes)
    );
} catch {
    return null;
}
};

// ================================
// WATCH TOGETHER — GROUP CREATION
// ================================

// Create the main group invitation
export const createGroupInvitation = (
groupId: string,
movieIds: string[],
participants: { id: string; name: string }[]
): GroupInvitation | null => {
const validMovieIds = validateMovieIds(movieIds);
const validParticipants = participants
    .filter((participant) =>
        participant.id.trim() && participant.name.trim()
    )
    .map((participant) => ({
        id: participant.id,
        name: participant.name.trim().slice(0, 30),
    }));

const uniqueParticipants = validParticipants.filter(
    (participant, index, list) =>
        list.findIndex((item) => item.id === participant.id) === index
);

if (
    !groupId.trim() ||
    validMovieIds.length === 0 ||
    uniqueParticipants.length < GROUP_MIN_PARTICIPANTS ||
    uniqueParticipants.length > GROUP_MAX_PARTICIPANTS
) {
    return null;
}

return {
    v: 2,
    type: "group-invitation",
    groupId,
    dataset: "movies-v1",
    movieIds: validMovieIds,
    participants: uniqueParticipants,
};
};

// Create an individual invitation for one participant
export const createParticipantInvitation = (
group: GroupInvitation,
participantId: string
): ParticipantInvitation | null => {
const participant = group.participants.find(
(item) => item.id === participantId
);
if (!participant) return null;

return {
    v: 2,
    type: "participant-invitation",
    groupId: group.groupId,
    dataset: group.dataset,
    movieIds: [...group.movieIds],
    participant: { ...participant },
};
};
// Create a participant's completed submission
export const createParticipantSubmission = (
groupId: string,
participant: ParticipantResult
): ParticipantSubmission => ({
v: 2,
type: "participant-submission",
groupId,
dataset: "movies-v1",
participant: {
...participant,
likedIds: validateMovieIds(participant.likedIds),
dislikedIds: validateMovieIds(participant.dislikedIds)
.filter((id) => !participant.likedIds.includes(id)),
},
});

// Assemble the final group results
export const createGroupResults = (
groupId: string,
movieIds: string[],
participants: ParticipantResult[]
): GroupResults | null => {
const validMovieIds = validateMovieIds(movieIds);
const validParticipants = participants
    .map(validateParticipantResult)
    .filter(
        (participant): participant is ParticipantResult =>
            participant !== null
    )
    .map((participant) => ({
        ...participant,
        likedIds: participant.likedIds.filter((id) =>
            validMovieIds.includes(id)
        ),
        dislikedIds: participant.dislikedIds.filter((id) =>
            validMovieIds.includes(id)
        ),
    }));

const uniqueParticipants = validParticipants.filter(
    (participant, index, list) =>
        list.findIndex((item) => item.id === participant.id) === index
);

if (
    !groupId.trim() ||
    validMovieIds.length === 0 ||
    uniqueParticipants.length < GROUP_MIN_PARTICIPANTS ||
    uniqueParticipants.length > GROUP_MAX_PARTICIPANTS
) {
    return null;
}

return {
    v: 2,
    type: "group-results",
    groupId,
    dataset: "movies-v1",
    movieIds: validMovieIds,
    participants: uniqueParticipants,
};
};