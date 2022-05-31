import { AccountCircle, DarkMode, LightMode } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, MenuList } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { UserContext } from "../lib/context";
import { Link } from "react-router-dom";

import "../styles/NavbarMenu.css";

type NavbarMenuProps = {
  onThemeChange: (theme: "light" | "dark") => void;
};

export const NavbarMenu = ({ onThemeChange }: NavbarMenuProps) => {
  const { username } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLightTheme, setIsLightTheme] = useState(true);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    event.stopPropagation();
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
      {/* <GlobalStyles styles={{ ul: { backgroundColor: "var(--test)" } }} /> */}
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MenuIcon style={{ color: "var(--ui-fixed)" }} />
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
          sx: {
            backgroundColor: "var(--card-bg)",
            color: "var(--main-text)",
          },
        }}
      >
        <MenuItem sx={{ color: "var(--main-text" }}>
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
        <MenuItem onClick={() => setIsLightTheme(!isLightTheme)}>
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
