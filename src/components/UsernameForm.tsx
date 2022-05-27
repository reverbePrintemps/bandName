import { DEFAULT_TOAST_DURATION } from "../constants/constants";
import { useState, useEffect, useCallback } from "react";
import { UsernameMessage } from "./UsernameMessage";
import { SignInButton } from "./SignInButton";
import { firestore } from "../lib/firebase";
import { useNavigate } from "react-router";
import { debounce } from "@mui/material";
import { UserData } from "../lib/hooks";
import { User } from "firebase/auth";
import toast from "react-hot-toast";
import { Spinner } from "./Spinner";

import "../styles/UsernameForm.css";

type UsernameFormProps = {
  userData: UserData;
};

export const UsernameForm = ({ userData }: UsernameFormProps) => {
  const user = userData.user;
  const username = userData.username;
  const userIsRegistered = username === typeof "string" && username.length > 0;
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userIsRegistered) {
      navigate("/");
    }
  }, [navigate, userIsRegistered]);

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
  }, [formValue]);

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

    try {
      await batch.commit().then(() => {
        toast.success("Account created successfully! Redirecting...");
        setFormLoading(true);
        setTimeout(() => {
          navigate("/");
        }, DEFAULT_TOAST_DURATION);
      });
    } catch (error) {
      // TODO handle error
      toast.error(
        "There was an error while creating your account. Please try again later."
      );
      setFormLoading(false);
      console.log(error);
    }
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
        <SignInButton />
      ) : !formLoading ? (
        <>
          <h3 className="UsernameForm__title">Choose Username</h3>
          <form onSubmit={(e) => onSubmit(e, user)}>
            <input
              className="UsernameForm__input"
              name="username"
              placeholder="myusername"
              value={formValue}
              onChange={onChange}
            />
            <UsernameMessage
              username={formValue}
              isValid={isValid}
              loading={usernameLoading}
            />
            <button
              className="UsernameForm__button"
              type="submit"
              disabled={!isValid}
            >
              Create account
            </button>
          </form>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};
