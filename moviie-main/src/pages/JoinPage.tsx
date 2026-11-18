import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Intro } from "../companents/Intro";
import { decodeInvitation, freshSession, getName, saveSession, setName as saveName } from "../modul";
import { Input } from "../companents/Input";

function JoinPage() {
    const nav = useNavigate();
   const loc = useLocation();
   const encoded = new URLSearchParams(loc.hash.slice(1)).get("s");
   const invitation = encoded ? decodeInvitation(encoded) : null;
   const [name, setName] = useState("");

    if (!invitation) {
         return (
             <Intro>
                <div className="center-block">
               <h2>Invitation not found</h2>
            </div>
         </Intro>
      );
   }

   function handleSaveName () {
     if (!name.trim() || !invitation) return;
     const first = { name: invitation.name, likes: invitation.likes };
     saveName(name.trim());
    saveSession(freshSession(name.trim(), first));
     nav("/game");
   }

 return (
        <Intro>
         <div
            className="join-form"
         >
            <h2>{invitation.name} invites you to pick a movie together!</h2>
            <p>Let's compare your favourite movies and find a movie you'll both enjoy!</p>


            <Input value={name} onChange={setName} onClick={handleSaveName} />
         </div>
      </Intro>
    );
}

export {JoinPage}