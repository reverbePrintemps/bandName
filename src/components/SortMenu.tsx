import {
  FormControl,
  FormLabel,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
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

  return (
    <div className="SortMenu">
      <IconButton onClick={handleClick} className="SortMenu__icon">
        <Sort />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          style: {
            backgroundColor: "var(--card-bg)",
            color: "var(--main-text)",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            onSortPressed("createdAt");
            setAnchorEl(null);
          }}
        >
          Sort by Most Recent
        </MenuItem>
        <MenuItem
          onClick={() => {
            onSortPressed("heartCount");
            setAnchorEl(null);
          }}
        >
          Sort by Most Popular
        </MenuItem>
      </Menu>
    </div>
  );
};
