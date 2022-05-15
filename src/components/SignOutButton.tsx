import { auth } from "../lib/firebase";

export const SignOutButton = () => {
  return <button onClick={() => auth.signOut()}>Sign Out</button>;
};
