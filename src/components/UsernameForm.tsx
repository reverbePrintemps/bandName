import { DEFAULT_TOAST_DURATION } from "../constants/constants";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { useState, useEffect, useCallback } from "react";
import { UsernameMessage } from "./UsernameMessage";
import { CustomButton } from "./CustomButton";
import { firestore } from "../lib/firebase";
import { useNavigate } from "react-router";
import { UserData } from "../lib/hooks";
import { User } from "firebase/auth";
import toast from "react-hot-toast";
import { Spinner } from "./Spinner";
import {
  debounce,
  FilledInput,
  FormControl,
  FormHelperText,
  InputLabel,
} from "@mui/material";

import "../styles/UsernameForm.css";

type UsernameFormProps = {
  userData: UserData;
};

export const UsernameForm = ({ userData }: UsernameFormProps) => {
  const user = userData.user;
  const username = userData.username;
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [formLoading, setFormLoading] = useState<boolean>();
  const navigate = useNavigate();

  useEffect(() => {
    const userIsRegistered =
      typeof username === "string" && username.length > 0;
    if (userIsRegistered) {
      navigate("/");
    }
  }, [username, navigate]);

  // Hit the database for username match after each debounced change
  // useCallback is required for debounce to work
  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = firestore.doc(`usernames/${username}`);
        const { exists } = await ref.get();
        setIsValid(!exists);
        setUsernameLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue, checkUsername]);

  const onSubmit = async (e: { preventDefault: () => void }, user: User) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = firestore.doc(`users/${user.uid}`);
    const usernameDoc = firestore.doc(`usernames/${formValue}`);

    // Commit both docs together as a batch write.
    const batch = firestore.batch();
    batch.set(userDoc, {
      username: formValue,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    toast
      .promise(batch.commit(), {
        loading: "Discombobulating 1s and 0s...",
        success: "Account created successfully! Get crackin' 🤘",
        error:
          "Woops, there was an error while creating your account. Please try again later.",
      })
      .then(() => {
        setTimeout(() => {
          navigate("/");
        }, DEFAULT_TOAST_DURATION);
      })
      .catch((error) => {
        // TODO handle error
        setFormLoading(false);
        console.log(error);
      });
  };

  const onChange = (e: { target: { value: string } }) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setUsernameLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setUsernameLoading(true);
      setIsValid(false);
    }
  };

  return (
    <div className="UsernameForm">
      {/* only return if not loading */}
      {!user ? (
        <GoogleSignInButton />
      ) : !formLoading && !username ? (
        <>
          <h2 className="UsernameForm__title">Choose Username</h2>
          <form onSubmit={(e) => onSubmit(e, user)}>
            <FormControl>
              <InputLabel htmlFor="username" className="UsernameForm__label">
                Username
              </InputLabel>
              <FilledInput
                id="username"
                name="username"
                value={formValue}
                onChange={onChange}
              />
              <FormHelperText>
                <UsernameMessage
                  username={formValue}
                  isValid={isValid}
                  loading={usernameLoading}
                />
              </FormHelperText>
            </FormControl>
            <CustomButton
              type="submit"
              label="Create Account"
              disabled={!isValid}
            />
          </form>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};
