import firebase from "firebase/compat";
import { useState } from "react";
import { firestore, auth, increment } from "../lib/firebase";
import "../styles/ClapButton.css";

// TODO Not a fan of this any
type ClapButtonProps = {
  ownPost: boolean;
  postRef: any;
  count: number;
};

export const ClapButton = ({ ownPost, postRef, count }: ClapButtonProps) => {
  const [shrink, setShrink] = useState(false);
  const [clapCount, setClapCount] = useState(count);
  const currentlySignedInUser = auth.currentUser;
  const clapRef = auth.currentUser
    ? postRef.collection("hearts").doc(auth.currentUser.uid)
    : undefined;

  // Create a user-to-post relationship
  const addClap = async (id: string) => {
    const uid = id;
    const batch = firestore.batch();

    batch.update(postRef, { heartCount: increment(1) });
    batch.set(clapRef, { uid });

    await batch.commit();
  };

  const handleInteractionStart = () => {
    setShrink(true);
  };

  const handleInteractionEnd = (currentlySignedInUser: firebase.User) => {
    addClap(currentlySignedInUser.uid);
    setShrink(false);
    setClapCount(clapCount + 1);
  };

  return !ownPost && currentlySignedInUser ? (
    <button
      className={`ClapButton ${shrink ? "m-shrink" : ""}`}
      onMouseDown={handleInteractionStart}
      onTouchStart={handleInteractionStart}
      onMouseUp={() => {
        handleInteractionEnd(currentlySignedInUser);
      }}
      onTouchEnd={() => {
        handleInteractionEnd(currentlySignedInUser);
      }}
    >{`${clapCount} 👏`}</button>
  ) : (
    <p className="ClapButton__count">{`${count} 👏`}</p>
  );
};
