import { DocumentData } from "firebase/firestore";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import { SignOutButton } from "./SignOutButton";
import avatarImage from "../assets/hacker.png";
import "../styles/UserProfile.css";

type UserProfileProps = {
  user: DocumentData;
};

export const UserProfile = ({ user }: UserProfileProps) => {
  const { user: signedIn } = useContext(UserContext);
  return (
    <div className="UserProfile">
      <img width={50} height={50} src={avatarImage} alt="Profile" />
      <h1 className="UserProfile__username">
        {user.username ? `u/${user.username}` : "Anonymous"}
      </h1>
      {signedIn && (
        <div className="UserProfile__signOut">
          <SignOutButton />
        </div>
      )}
    </div>
  );
};
