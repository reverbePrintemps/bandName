import { auth, googleAuthProvider } from "../lib/firebase";
import "../styles/SignInButton.css";

export const SignInButton = () => {
  const signInWithGoogle = async () => {
    await auth.signInWithPopup(googleAuthProvider);
  };

  return (
    <button className="SignInButton" onClick={signInWithGoogle}>
      <img
        src={require("../assets/google.png")}
        alt="Google icon"
        width={30}
        height={30}
      />
      <p className="SignInButton__text">Sign in</p>
    </button>
  );
};
