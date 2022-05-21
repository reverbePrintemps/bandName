import { auth, googleAuthProvider } from "../lib/firebase";
import googleIcon from "../assets/google.png";
import "../styles/SignInButton.css";
import toast from "react-hot-toast";
import { useUserData } from "../lib/hooks";

export const SignInButton = () => {
  const userInfo = useUserData();

  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <button
      className="SignInButton"
      onClick={() => {
        toast.promise(signInWithGoogle(), {
          loading: "Signing you in...",
          success: userInfo.username
            ? "You're now signed in! Get crackin on the band names! 🤘"
            : "Welcome to Band Name!, pick a username :)",
          error: "Woops, there was an error signing you in. Please try again.",
        });
      }}
    >
      <img src={googleIcon} alt="Google icon" width={22} height={22} />
      <p className="SignInButton__text">Sign in</p>
    </button>
  );
};
