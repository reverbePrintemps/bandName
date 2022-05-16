import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../lib/context";
import "../styles/Navbar.css";

// Top navbar
export default function Navbar() {
  const { user, username } = useContext(UserContext);

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
      {/* user is signed-in and has username */}
      {user && username && (
        <div className="Navbar__profile">
          <Link to={`/${username}`}>
            <img
              width={50}
              height={50}
              className="Navbar__image"
              src={"/hacker.png"}
              alt="User profile"
            />
          </Link>
          <h4 className="Navbar__username">u/{username}</h4>
        </div>
      )}
      {/* user is not signed OR has not created username */}
      {!username && (
        <Link to="/enter">
          <button className="btn-blue">Log in</button>
        </Link>
      )}
    </nav>
  );
}
