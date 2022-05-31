import { DEFAULT_TOAST_DURATION } from "../constants/constants";
import { useNavigate } from "react-router";
import { auth } from "../lib/firebase";
import toast from "react-hot-toast";

import "../styles/SignOutButton.css";

export const SignOutButton = () => {
  const navigate = useNavigate();
  return (
    <button
      className="SignOutButton"
      onClick={() => {
        toast
          .promise(auth.signOut(), {
            loading: "Signing you out...",
            success: "You're now signed out.",
            error:
              "Woops, there was an error signing you out. Please try again.",
          })
          .then(() => {
            setTimeout(() => {
              navigate("/");
            }, DEFAULT_TOAST_DURATION);
          });
      }}
    >
      Sign Out
    </button>
  );
};
