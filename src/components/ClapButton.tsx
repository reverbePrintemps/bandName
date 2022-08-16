import { CardButton, CardButtonKind } from "./CardButton";
import { useCallback, useEffect, useState } from "react";
import { useUserData } from "../lib/hooks";
import { debounce } from "@mui/material";
import firebase from "firebase/compat";
import { User } from "firebase/auth";
import toast from "react-hot-toast";

import "../styles/ClapButton.css";

type ClapButtonProps = {
  postRef: firebase.firestore.DocumentReference;
  ownPost: boolean;
  count: number;
};

export const ClapButton = ({ ownPost, postRef, count }: ClapButtonProps) => {
  const userData = useUserData();
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

  return !ownPost && user ? (
    <CardButton
      kind={CardButtonKind.Clap}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addClap();
        setClapCount(clapCount + 1);
      }}
    >
      {clapCount} 👏
    </CardButton>
  ) : (
    <CardButton
      kind={CardButtonKind.Clap}
      disabled
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        !user
          ? toast.error("You must be signed in to clap.")
          : toast.error("You can't clap your own posts! Nice try though. 🤦‍♀️");
      }}
    >
      {count} 👏
    </CardButton>
  );
};
