import { MouseEvent, TouchEvent, useEffect, useState } from "react";
import { firestore, increment } from "../lib/firebase";
import { useUserData } from "../lib/hooks";
import firebase from "firebase/compat";
import { User } from "firebase/auth";

import "../styles/ClapButton.css";

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

  const handleInteractionStart = (
    e:
      | MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
      | TouchEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setShrink(true);
  };

  const handleInteractionEnd = (
    e:
      | MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
      | TouchEvent<HTMLButtonElement>,
    currentlySignedInUser: User
  ) => {
    e.preventDefault();
    e.stopPropagation();
    addClap(currentlySignedInUser.uid);
    setShrink(false);
    setClapCount(clapCount + 1);
  };

  return !ownPost && user ? (
    <button
      className={`ClapButton ${shrink ? "m-shrink" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onMouseDown={(e) => handleInteractionStart(e)}
      onTouchStart={(e) => handleInteractionStart(e)}
      onMouseUp={(e) => {
        handleInteractionEnd(e, user);
      }}
      onTouchEnd={(e) => {
        handleInteractionEnd(e, user);
      }}
    >{`${clapCount} 👏`}</button>
  ) : (
    <p className="ClapButton__count">{`${count} 👏`}</p>
  );
};
