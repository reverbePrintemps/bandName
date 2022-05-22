import { useState, useEffect, useCallback, useContext } from "react";
import { DEFAULT_TOAST_DURATION } from "../constants/constants";
import { UsernameMessage } from "./UsernameMessage";
import { UserContext } from "../lib/context";
import { firestore } from "../lib/firebase";
import { useNavigate } from "react-router";
import { debounce } from "@mui/material";
import toast from "react-hot-toast";
import { Spinner } from "./Spinner";
import { Navbar } from "./Navbar";

import "../styles/UsernameForm.css";

export const UsernameForm = () => {
  const { user } = useContext(UserContext);
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const navigate = useNavigate();

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

  if (!user) {
    return null;
  }

  const onSubmit = async (e: { preventDefault: () => void }) => {
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
      <Navbar noSignIn noProfile={false} />
      {/* only return if not loading */}
      {!formLoading ? (
        <>
          <h3 className="UsernameForm__title">Choose Username</h3>
          <form onSubmit={onSubmit}>
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
