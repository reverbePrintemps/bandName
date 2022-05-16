import { DocumentData } from "firebase/firestore";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import { SignOutButton } from "./SignOutButton";
import "./styles/UserProfile.css";

type UserProfileProps = {
  user: DocumentData;
};

export const UserProfile = ({ user }: UserProfileProps) => {
  const { user: signedIn } = useContext(UserContext);
  return (
    <div className="UserProfile">
      <img
        width={50}
        height={50}
        src={require("../assets/hacker.png")}
        alt="Profile"
      />
      <h1>u/{user.username || "Anonymous User"}</h1>
      {signedIn && <SignOutButton />}
    </div>
  );
};

export default UserProfile;
