import { AccountCircle } from "@mui/icons-material";
import { SignOutButton } from "./SignOutButton";
import "../styles/UserProfile.css";

type UserProfileProps = {
  username: string | null;
};

export const UserProfile = ({ username }: UserProfileProps) => {
  return (
    <div className="UserProfile">
      <AccountCircle />
      <h1 className="UserProfile__username">{`u/${username}`}</h1>
      {username && (
        <div className="UserProfile__signOut">
          <SignOutButton />
        </div>
      )}
    </div>
  );
};
