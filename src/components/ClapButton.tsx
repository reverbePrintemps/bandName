import { useUserData } from "../lib/hooks";
import { debounce } from "@mui/material";
import firebase from "firebase/compat";
import { User } from "firebase/auth";
import toast from "react-hot-toast";
import {
  MouseEvent,
  TouchEvent,
  useCallback,
  useEffect,
  useState,
} from "react";

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
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (userData.user) {
      setUser(userData.user);
    }
  }, [userData.user]);

  const addClap = useCallback(
    debounce(async () => {
      postRef.update({ heartCount: clapCount + 1 });
    }, 500),
    [clapCount, postRef]
  );

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
      | TouchEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    addClap();
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
        handleInteractionEnd(e);
      }}
      onTouchEnd={(e) => {
        handleInteractionEnd(e);
      }}
    >{`${clapCount} 👏`}</button>
  ) : (
    <button
      className="ClapButton m-disabled"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        !user
          ? toast.error("You must be signed in to clap.")
          : toast.error("You can't clap your own posts! Nice try though. 🤦‍♀️");
      }}
    >{`${count} 👏`}</button>
  );
};
