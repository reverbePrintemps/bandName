import { IconButton, Menu, MenuItem } from "@mui/material";
import { Sort } from "@mui/icons-material";
import { useState } from "react";

import "../styles/SortMenu.css";

type SortMenuProps = {
  onSortPressed: (sort: "createdAt" | "heartCount") => void;
};

export const SortMenu = ({ onSortPressed }: SortMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (menuItem?: string | null) => {
    const orderBy =
      menuItem && menuItem === "Most recent"
        ? "createdAt"
        : menuItem === "Most popular"
        ? "heartCount"
        : undefined;
    orderBy && onSortPressed(orderBy);
    setAnchorEl(null);
  };
  return (
    <div className="SortMenu">
      <IconButton onClick={handleClick} className="SortMenu__icon">
        <Sort />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => handleClose()}
        PaperProps={{
          style: {
            backgroundColor: "var(--card-bg)",
            color: "var(--main-text)",
          },
        }}
      >
        <MenuItem onClick={(e) => handleClose(e.currentTarget.textContent)}>
          Most recent
        </MenuItem>
        <MenuItem onClick={(e) => handleClose(e.currentTarget.textContent)}>
          Most popular
        </MenuItem>
      </Menu>
    </div>
  );
};
