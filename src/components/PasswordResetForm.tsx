import { DEFAULT_TOAST_DURATION } from "../constants/constants";
import { sendPasswordResetEmail } from "firebase/auth";
import { InfoRounded } from "@mui/icons-material";
import { CustomButton } from "./CustomButton";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { auth } from "../lib/firebase";
import toast from "react-hot-toast";
import {
  FormControl,
  InputLabel,
  FilledInput,
  Box,
  Typography,
} from "@mui/material";

import "../styles/PasswordResetForm.css";

export const PasswordResetForm = () => {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "Woops, something went wrong, please try again."
  );
  const navigate = useNavigate();

  useEffect(() => {
    const isValid = email.length > 0;
    setIsValid(isValid);
  }, [email]);

  return (
    <div className="PasswordResetForm__container">
      <h1 className="PasswordResetForm__title">Reset password</h1>
      <form
        className="PasswordResetForm"
        onSubmit={(e) => {
          e.preventDefault();
          sendPasswordResetEmail(auth, email)
            .then(() => {
              toast.success(
                "A password reset code was sent to your email address"
              );
              setTimeout(() => {
                navigate("/login");
              }, DEFAULT_TOAST_DURATION);
            })
            .catch((error) => {
              if (error.code === "auth/user-not-found") {
                setErrorMessage(
                  "We don't know about this email address, are you sure it is correct?"
                );
              } else if (error.code === "auth/invalid-email") {
                setErrorMessage(
                  "It seems that this email address might be invalid. Please check and try again."
                );
              } else {
                setErrorMessage(
                  "Woops, something went wrong, please try again."
                );
              }
              toast.error(errorMessage);
            });
        }}
      >
        <FormControl className="PasswordResetForm__inputContainer">
          <InputLabel htmlFor="email" className="PasswordResetForm__inputLabel">
            Email address
          </InputLabel>
          <FilledInput
            id="email"
            className="PasswordResetForm__input"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <div className="PasswordResetForm__submitButton">
          <CustomButton
            type="submit"
            label="Send password reset link"
            disabled={!isValid}
          />
        </div>
      </form>
      <Box className="PasswordResetForm__infoContainer">
        <InfoRounded />
        <Typography className="PasswordResetForm__infoText">
          Please check your inbox and/or spam folder for your password reset
          link
        </Typography>
      </Box>
    </div>
  );
};
