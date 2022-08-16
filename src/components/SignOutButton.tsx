import { DEFAULT_TOAST_DURATION } from "../constants/constants";
import { CustomButton } from "./CustomButton";
import { useNavigate } from "react-router";
import { auth } from "../lib/firebase";
import toast from "react-hot-toast";
import React from "react";

type SignOutButtonProps = { username: string };

export const SignOutButton = ({ username }: SignOutButtonProps) => {
  const navigate = useNavigate();
  return (
    <div className="UserProfile__signOut">
      <CustomButton
        type="button"
        label="Sign out"
        onClick={() => {
          toast
            .promise(auth.signOut(), {
              loading: "Signing you out...",
              success: "You're now signed out.",
              error:
                "Woops, there was an error signing you out. Please try again.",
            })
            .then(() => {
              setTimeout(() => {
                navigate("/");
              }, DEFAULT_TOAST_DURATION);
            });
        }}
      />
    </div>
  );
};
