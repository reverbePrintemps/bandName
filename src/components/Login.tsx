import { GoogleSignInButton } from "./GoogleSignInButton";
import { EmailSignInForm } from "./EmailSignInForm";
import { Box, Typography } from "@mui/material";
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
            <Typography className="Login__methodTitle">With Google</Typography>
            <Box marginTop="16px">
              <GoogleSignInButton />
            </Box>
            <Box marginTop="16px">
              <Typography className="Login__methodTitle">or email</Typography>
              <EmailSignInForm />
            </Box>
          </>
        ) : !userData.username ? (
          <UsernameForm userData={userData} />
        ) : null}
      </div>
    </div>
  );
};
