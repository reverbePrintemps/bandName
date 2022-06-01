import { AccountCircle, DarkMode, LightMode } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { UserContext } from "../lib/context";
import { Link } from "react-router-dom";

import "../styles/NavbarMenu.css";

type NavbarMenuProps = {
  theme: "light" | "dark";
  onThemeChange: (theme: "light" | "dark") => void;
};

export const NavbarMenu = ({ theme, onThemeChange }: NavbarMenuProps) => {
  const { username } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLightTheme, setIsLightTheme] = useState<boolean>(theme === "light");

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (isLightTheme) {
      onThemeChange("light");
    } else {
      onThemeChange("dark");
    }
  }, [isLightTheme]);

  return (
    <div className="Navbar__menu">
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MenuIcon style={{ color: "#ccc" }} />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        PaperProps={{
          style: {
            backgroundColor: "var(--card-bg)",
            color: "var(--main-text)",
          },
        }}
      >
        <MenuItem sx={{ color: "var(--main-text" }} onClick={handleClose}>
          {username ? (
            <Link
              className="NavbarMenu__menuLink"
              to={`/posts/username/${username}`}
            >
              <AccountCircle />
              <p className="NavbarMenu">My Profile</p>
            </Link>
          ) : (
            <Link className="NavbarMenu__menuLink" to={`/signup`}>
              <AccountCircle />
              <p className="NavbarMenu">Sign in</p>
            </Link>
          )}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            setIsLightTheme(!isLightTheme);
          }}
        >
          {isLightTheme ? (
            <>
              <DarkMode />
              <p className="NavbarMenu">Dark Mode</p>
            </>
          ) : (
            <>
              <LightMode />
              <p className="NavbarMenu">Light Mode</p>
            </>
          )}
        </MenuItem>
      </Menu>
    </div>
  );
};
