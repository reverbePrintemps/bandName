import { Link } from "react-router-dom";
import { SignInButton } from "./SignInButton";
import { useUserData } from "../lib/hooks";

import "../styles/Navbar.css";

export const Navbar = () => {
  const userData = useUserData();
  return (
    <nav className="Navbar">
      <div className="Navbar__container">
        <Link to="/">
          <img
            className="Navbar__logo"
            // Ratio of image is 1,91:1
            width={152.8}
            height={80}
            // TODO ????
            src={require("../assets/band-name-logo.png")}
            alt="BandName! logo"
          />
        </Link>
        {userData.username ? (
          <Link
            className="Navbar__profileContainer"
            to={`/${userData.username}`}
          >
            <div className="Navbar__profile">
              <img
                width={50}
                height={50}
                className="Navbar__image"
                src={require("../assets/hacker.png")}
                alt="User profile"
              />
              <h4 className="Navbar__username">u/{userData.username}</h4>
            </div>
          </Link>
        ) : (
          <SignInButton />
        )}
      </div>
    </nav>
  );
};
