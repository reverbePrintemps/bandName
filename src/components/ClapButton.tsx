import { firestore, increment } from "../lib/firebase";
import { useEffect, useState } from "react";
import { useUserData } from "../lib/hooks";
import firebase from "firebase/compat";
import { User } from "firebase/auth";

import "../styles/ClapButton.css";

// TODO Not a fan of this any
type ClapButtonProps = {
  ownPost: boolean;
  postRef: firebase.firestore.DocumentReference;
  count: number;
};

export const ClapButton = ({ ownPost, postRef, count }: ClapButtonProps) => {
  const userData = useUserData();
  const [shrink, setShrink] = useState(false);
  const [clapCount, setClapCount] = useState(count);
  const clapRef = postRef.collection("hearts").doc(userData.user?.uid);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (userData.user) {
      setUser(userData.user);
    }
  }, [userData.user]);

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

  const handleInteractionEnd = (currentlySignedInUser: User) => {
    addClap(currentlySignedInUser.uid);
    setShrink(false);
    setClapCount(clapCount + 1);
  };

  return !ownPost && user ? (
    <button
      className={`ClapButton ${shrink ? "m-shrink" : ""}`}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={handleInteractionStart}
      onTouchStart={handleInteractionStart}
      onMouseUp={() => {
        handleInteractionEnd(user);
      }}
      onTouchEnd={() => {
        handleInteractionEnd(user);
      }}
    >{`${clapCount} 👏`}</button>
  ) : (
    <p className="ClapButton__count">{`${count} 👏`}</p>
  );
};
