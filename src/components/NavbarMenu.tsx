import { AccountCircle, Home, Info } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useContext, useState } from "react";
import { UserContext } from "../lib/context";
import { Link } from "react-router-dom";

import "../styles/NavbarMenu.css";

export const NavbarMenu = () => {
  const { username } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isHome = window.location.pathname === "/";

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="NavbarMenu">
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MenuIcon className="NavbarMenu__icon" />
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
          <Link
            className="NavbarMenu__menuLink"
            to="/"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            <Home />
            <p className="NavbarMenu">{isHome ? "Scroll to top" : "Home"}</p>
          </Link>
        </MenuItem>
        <MenuItem sx={{ color: "var(--main-text" }} onClick={handleClose}>
          <Link className="NavbarMenu__menuLink" to="/about">
            <Info />
            <p className="NavbarMenu">About</p>
          </Link>
        </MenuItem>
        <MenuItem sx={{ color: "var(--main-text" }} onClick={handleClose}>
          {username ? (
            <Link
              className="NavbarMenu__menuLink"
              to={`/posts/username/${username}`}
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
            >
              <AccountCircle />
              <p className="NavbarMenu">My Profile</p>
            </Link>
          ) : (
            <Link className="NavbarMenu__menuLink" to="/login">
              <AccountCircle />
              <p className="NavbarMenu">Sign in</p>
            </Link>
          )}
        </MenuItem>
      </Menu>
    </div>
  );
};
