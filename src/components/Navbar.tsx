import { Link } from "react-router-dom";
import { SignInButton } from "./SignInButton";
import { useContext } from "react";
import { UserContext } from "../lib/context";

import "../styles/Navbar.css";

type NavBarProps = {
  noSignIn?: boolean;
};

export const Navbar = ({ noSignIn }: NavBarProps) => {
  const { user, username } = useContext(UserContext);

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
        {username ? (
          <Link className="Navbar__profileContainer" to={`/${username}`}>
            <div className="Navbar__profile">
              <img
                width={50}
                height={50}
                className="Navbar__image"
                src={require("../assets/hacker.png")}
                alt="User profile"
              />
              <h4 className="Navbar__username">u/{username}</h4>
            </div>
          </Link>
        ) : noSignIn ? null : (
          <SignInButton />
        )}
      </div>
    </nav>
  );
};
