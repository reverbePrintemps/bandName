import { DEFAULT_TOAST_DURATION } from "../constants/constants";
import { AccountCircle } from "@mui/icons-material";
import { CustomButton } from "./CustomButton";
import { useNavigate } from "react-router";
import { auth } from "../lib/firebase";
import toast from "react-hot-toast";

import "../styles/UserProfile.css";

type UserProfileProps = {
  username: string | null;
};

export const UserProfile = ({ username }: UserProfileProps) => {
  const navigate = useNavigate();
  return (
    <div className="UserProfile">
      <AccountCircle />
      <h1 className="UserProfile__username">{`u/${username}`}</h1>
      {username && (
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
      )}
    </div>
  );
};
