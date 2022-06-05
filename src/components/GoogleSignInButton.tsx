import { DEFAULT_TOAST_DURATION } from "../constants/constants";
import { auth, googleAuthProvider } from "../lib/firebase";
import googleIcon from "../assets/google.png";
import { CustomButton } from "./CustomButton";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export const GoogleSignInButton = () => {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };
  const navigate = useNavigate();

  return (
    <CustomButton
      type="button"
      label="Sign in"
      icon={googleIcon}
      onClick={() => {
        toast
          .promise(signInWithGoogle(), {
            loading: "Signing you in...",
            success: "You're now signed in! Get crackin' 🤘",
            error:
              "Woops, there was an error signing you in. Please try again.",
          })
          .then(() => {
            setTimeout(() => {
              navigate("/login");
            }, DEFAULT_TOAST_DURATION);
          });
      }}
    />
  );
};
