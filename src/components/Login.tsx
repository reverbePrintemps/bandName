import { GoogleSignInButton } from "./GoogleSignInButton";
import { EmailSignInForm } from "./EmailSignInForm";
import { UsernameForm } from "./UsernameForm";
import { useUserData } from "../lib/hooks";
import { useNavigate } from "react-router";

import "../styles/Login.css";

export const Login = () => {
  const userData = useUserData();
  const navigate = useNavigate();
  if (userData.username) {
    navigate("/");
  }
  return (
    <div className="Login">
      <h1 className="Login__title">Sign in</h1>
      <div className="Login__methods">
        {!userData.user ? (
          <>
            <h2>With Google</h2>
            <GoogleSignInButton />
            <h2>or email</h2>
            <EmailSignInForm />
          </>
        ) : !userData.username ? (
          <UsernameForm userData={userData} />
        ) : null}
      </div>
    </div>
  );
};
