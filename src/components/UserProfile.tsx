import { AccountCircle } from "@mui/icons-material";

import "../styles/UserProfile.css";

type UserProfileProps = {
  username: string | null;
  direction: "row" | "column";
};

export const UserProfile = ({ username, direction }: UserProfileProps) => {
  return (
    <div className={`UserProfile ${direction === "column" ? "m-column" : ""}`}>
      <AccountCircle
        className={`UserProfile__icon ${
          direction === "column" ? "m-column" : ""
        }`}
      />
      <h1
        className={`UserProfile__username ${
          direction === "column" ? "m-column" : ""
        }`}
      >{`u/${username}`}</h1>
    </div>
  );
};
