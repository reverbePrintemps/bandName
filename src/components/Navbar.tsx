import { DarkMode, LightMode } from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import bandNameLogo from "../assets/band-name-logo.png";
import { IconButton, Tooltip } from "@mui/material";
import { NavbarMenu } from "./NavbarMenu";
import { Link } from "react-router-dom";

import "../styles/Navbar.css";

type NavBarProps = {
  theme: string;
  onClick: () => void;
  onThemeChange: (theme: "light" | "dark") => void;
};

export const Navbar = ({ theme, onClick, onThemeChange }: NavBarProps) => {
  const [isLightTheme, setIsLightTheme] = useState<boolean>(theme === "light");

  const onThemeChangeCallback = useCallback(
    (isLightTheme: "light" | "dark") => {
      onThemeChange(isLightTheme);
    },
    [onThemeChange]
  );
  useEffect(() => {
    if (isLightTheme) {
      onThemeChangeCallback("light");
    } else {
      onThemeChangeCallback("dark");
    }
  }, [isLightTheme, onThemeChangeCallback]);
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
        <div className="Navbar__right">
          <Tooltip title={isLightTheme ? "Dark Theme" : "Light Theme"}>
            <IconButton
              style={{ color: "#ccc" }}
              onClick={() => setIsLightTheme(!isLightTheme)}
            >
              {isLightTheme ? <DarkMode /> : <LightMode />}
            </IconButton>
          </Tooltip>
          <NavbarMenu />
        </div>
      </div>
    </nav>
  );
};
