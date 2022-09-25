import { IconButton, Menu, MenuItem } from "@mui/material";
import { Sort, ToggleOff, ToggleOn } from "@mui/icons-material";
import { useState } from "react";

import "../styles/SortMenu.css";

type SortMenuProps = {
  onSortPressed: (sort: "createdAt" | "heartCount") => void;
  onFilterPressed: (toggleNsfwOn: boolean) => void;
};

export const SortMenu = ({ onFilterPressed, onSortPressed }: SortMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [nsfwFilter, setNsfwFilter] = useState(true);
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
        <MenuItem
          onClick={() => {
            setNsfwFilter(!nsfwFilter);
            onFilterPressed(!nsfwFilter);
            setAnchorEl(null);
          }}
        >
          <IconButton>{nsfwFilter ? <ToggleOff /> : <ToggleOn />}</IconButton>
          {nsfwFilter ? "NSFW Filter On" : "NSFW Filter Off"}
        </MenuItem>
      </Menu>
    </div>
  );
};
