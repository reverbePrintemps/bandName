import { auth } from "../lib/firebase";
import "../styles/SignOutButton.css";

export const SignOutButton = () => {
  return (
    <button className="SignOutButton" onClick={() => auth.signOut()}>
      Sign Out
    </button>
  );
};
