import { MoreVert, Share } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MenuItem from "@mui/material/MenuItem";
import { IconButton } from "@mui/material";
import Menu from "@mui/material/Menu";
import { useState } from "react";

import "../styles/CardOverflowMenu.css";

type CardOverflowMenuProps = {
  isOwner: boolean;
  onEditPressed: () => void;
  onSharePressed: () => void;
  onDeletePressed: () => void;
};

export const CardOverflowMenu = ({
  isOwner,
  onEditPressed,
  onSharePressed,
  onDeletePressed,
}: CardOverflowMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        style={{ color: "var(--ui)" }}
      >
        <MoreVert />
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
        {isOwner && (
          <MenuItem
            onClick={(e) => {
              handleClose(e);
              onEditPressed();
            }}
          >
            <EditIcon />
            <p className="CardOverflowMenu__label">Edit</p>
          </MenuItem>
        )}
        <MenuItem
          onClick={(e) => {
            handleClose(e);
            onSharePressed();
          }}
        >
          <Share />
          <p className="CardOverflowMenu__label">Share</p>
        </MenuItem>
        {isOwner && (
          <MenuItem
            onClick={(e) => {
              handleClose(e);
              onDeletePressed();
            }}
          >
            <DeleteIcon />
            <p className="CardOverflowMenu__label">Delete</p>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
