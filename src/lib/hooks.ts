import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../lib/firebase";
import { useEffect, useState } from "react";
import { Auth, User } from "firebase/auth";

export type UserData = {
  user: User | null | undefined;
  username: string | null;
};

// Custom hook to read auth record and user profile doc
export const useUserData = (): UserData => {
  const typeCastAuth = auth as unknown as Auth;
  const [user] = useAuthState(typeCastAuth);
  const [username, setUsername] = useState<null | string>(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = firestore.collection("users").doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
};

export async function doesUserExist(username: string) {
  const ref = firestore.doc(`usernames/${username}`);
  const { exists } = await ref.get();
  return exists;
}
