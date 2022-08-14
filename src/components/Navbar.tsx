import bandNameLogo from "../assets/band-name-logo.png";
import { NavbarMenu } from "./NavbarMenu";
import { Link } from "react-router-dom";

import "../styles/Navbar.css";

type NavBarProps = {
  theme: string;
  onClick: () => void;
  onThemeChange: (theme: "light" | "dark") => void;
};

export const Navbar = ({ theme, onClick, onThemeChange }: NavBarProps) => {
  return (
    <nav className="Navbar">
      <div className="Navbar__container">
        <Link to="/" onClick={onClick}>
          <img
            className="Navbar__logo"
            // Ratio of image is 1,91:1 as per specs
            width={152.8}
            height={80}
            src={bandNameLogo}
            alt="BandName! logo"
          />
        </Link>
        <NavbarMenu theme={theme} onThemeChange={onThemeChange} />
      </div>
    </nav>
  );
};
