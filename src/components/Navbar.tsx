import { Link } from "react-router-dom";
import { SignInButton } from "./SignInButton";
import { Spinner } from "./Spinner";
import { useUserData } from "../lib/hooks";

import "../styles/Navbar.css";

export const Navbar = () => {
  const userData = useUserData();
  return (
    <nav className="Navbar">
      <Link to="/">
        <button className="Navbar__logo">
          <img
            width={110}
            height={80}
            // TODO ????
            src={require("../assets/band-name-logo.png")}
            alt="BandName! logo"
          />
        </button>
      </Link>
      {userData.username ? (
        <div className="Navbar__profile">
          <Link to={`/${userData.username}`}>
            <img
              width={50}
              height={50}
              className="Navbar__image"
              src={require("../assets/hacker.png")}
              alt="User profile"
            />
          </Link>
          <h4 className="Navbar__username">u/{userData.username}</h4>
        </div>
      ) : (
        <SignInButton />
      )}
    </nav>
  );
};
