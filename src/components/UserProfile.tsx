import { SignOutButton } from "./SignOutButton";
import avatarImage from "../assets/hacker.png";
import "../styles/UserProfile.css";

type UserProfileProps = {
  username: string | null;
};

export const UserProfile = ({ username }: UserProfileProps) => {
  return (
    <div className="UserProfile">
      <img width={50} height={50} src={avatarImage} alt="Profile" />
      <h1 className="UserProfile__username">{`u/${username}`}</h1>
      {username && (
        <div className="UserProfile__signOut">
          <SignOutButton />
        </div>
      )}
    </div>
  );
};
