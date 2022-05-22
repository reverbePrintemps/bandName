import { Link } from "react-router-dom";
import { SignInButton } from "./SignInButton";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import bandNameLogo from "../assets/band-name-logo.png";
import avatarImage from "../assets/hacker.png";

import "../styles/Navbar.css";

type NavBarProps = {
  noProfile: boolean;
  noSignIn: boolean;
};

export const Navbar = ({ noProfile, noSignIn }: NavBarProps) => {
  const { username } = useContext(UserContext);

  return (
    <nav className="Navbar">
      <div className="Navbar__container">
        <Link to="/">
          <img
            className="Navbar__logo"
            // Ratio of image is 1,91:1 as per specs
            width={152.8}
            height={80}
            src={bandNameLogo}
            alt="BandName! logo"
          />
        </Link>
        {!noProfile ? (
          username ? (
            <Link className="Navbar__profileContainer" to={`/${username}`}>
              <div className="Navbar__profile">
                <img
                  width={50}
                  height={50}
                  className="Navbar__image"
                  src={avatarImage}
                  alt="User profile"
                />
                <h4 className="Navbar__username">u/{username}</h4>
              </div>
            </Link>
          ) : noSignIn ? null : (
            <SignInButton />
          )
        ) : null}
      </div>
    </nav>
  );
};
