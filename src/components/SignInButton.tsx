import { auth, googleAuthProvider } from "../lib/firebase";
import googleIcon from "../assets/google.png";
import toast from "react-hot-toast";
import "../styles/SignInButton.css";

export const SignInButton = () => {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <button
      className="SignInButton"
      onClick={() => {
        toast.promise(signInWithGoogle(), {
          loading: "Signing you in...",
          success: "You’re now signed in! Let's get crackin' 🤘",
          error: "Woops, there was an error signing you in. Please try again.",
        });
      }}
    >
      <img src={googleIcon} alt="Google icon" width={22} height={22} />
      <p className="SignInButton__text">Sign in</p>
    </button>
  );
};
