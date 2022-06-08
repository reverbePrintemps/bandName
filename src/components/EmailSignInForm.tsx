import { FormControl, FilledInput, InputLabel } from "@mui/material";
import { DEFAULT_TOAST_DURATION } from "../constants/constants";
import React, { useEffect, useState } from "react";
import { CustomButton } from "./CustomButton";
import toast from "react-hot-toast";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  AuthError,
} from "firebase/auth";

import "../styles/EmailSignInForm.css";

const auth = getAuth();

const defaultValues = {
  email: "",
  password: "",
};
export const EmailSignInForm = () => {
  const [formValues, setFormValues] = useState(defaultValues);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const isValid =
      formValues.email.length > 0 && formValues.password.length > 0;
    setIsValid(isValid);
  }, [formValues]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.loading("Signing you in...", { duration: DEFAULT_TOAST_DURATION });
    signInWithEmailAndPassword(auth, formValues.email, formValues.password)
      .then((userCredential) => {
        const user = userCredential.user;
        auth.updateCurrentUser(user);
        toast.success("You're signed in! 🎉");
      })
      .catch((error: AuthError) => {
        const errorCode = error.code;

        switch (errorCode) {
          case "auth/user-not-found":
            toast.loading("Creating your account...", {
              duration: DEFAULT_TOAST_DURATION,
            });
            createUserWithEmailAndPassword(
              auth,
              formValues.email,
              formValues.password
            )
              .then((userCredential) => {
                const user = userCredential.user;
                auth.updateCurrentUser(user);
                toast.success(
                  "Your account has been created! Pick a username 🔥"
                );
              })
              .catch((error) => {
                const errorCode = error.code;
                if (errorCode === "auth/weak-password") {
                  toast.error("Your password is too weak. Please try again.");
                } else {
                  toast.error(error.message);
                }
              });
            break;
          case "auth/wrong-password":
            toast.error("Wrong password. Please try again.");
            break;
          default:
            toast.error(error.message);
        }
      });
  };

  const handleInputChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  return (
    <form className="EmailSignInForm" onSubmit={(e) => handleSubmit(e)}>
      <FormControl className="EmailSignInForm__inputContainer">
        <InputLabel htmlFor="email" className="EmailSignInForm__inputLabel">
          Email address
        </InputLabel>
        <FilledInput
          id="email"
          className="EmailSignInForm__input"
          name="email"
          type="email"
          value={formValues.email}
          onChange={handleInputChange}
        />
      </FormControl>
      <FormControl className="EmailSignInForm__inputContainer">
        <InputLabel htmlFor="password" className="EmailSignInForm__inputLabel">
          Password
        </InputLabel>
        <FilledInput
          id="password"
          className="EmailSignInForm__input"
          name="password"
          type="password"
          value={formValues.password}
          onChange={handleInputChange}
        />
      </FormControl>
      <div className="EmailSignInForm__submitButton">
        <CustomButton type="submit" label="Submit" disabled={!isValid} />
      </div>
    </form>
  );
};
