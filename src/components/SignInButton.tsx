import { auth, googleAuthProvider } from "../lib/firebase";
import googleIcon from "../assets/google.png";
import "../styles/SignInButton.css";

export const SignInButton = () => {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <button className="SignInButton" onClick={signInWithGoogle}>
      <img src={googleIcon} alt="Google icon" width={22} height={22} />
      <p className="SignInButton__text">Sign in</p>
    </button>
  );
};
