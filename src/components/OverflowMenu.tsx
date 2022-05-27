import * as React from "react";
import Menu from "@mui/material/Menu";
import { IconButton } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { MoreVert, Share } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import "../styles/BasicMenu.css";

type OverflowMenuProps = {
  isOwner: boolean;
  onEditPressed: () => void;
  onSharePressed: () => void;
  onDeletePressed: () => void;
};

export const OverflowMenu = ({
  isOwner,
  onEditPressed,
  onSharePressed,
  onDeletePressed,
}: OverflowMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
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
      >
        {isOwner && (
          <MenuItem
            onClick={() => {
              handleClose();
              onEditPressed();
            }}
          >
            <EditIcon />
            <p className="BasicMenu__label">Edit</p>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            handleClose();
            onSharePressed();
          }}
        >
          <Share />
          <p className="BasicMenu__label">Share</p>
        </MenuItem>
        {isOwner && (
          <MenuItem
            onClick={() => {
              handleClose();
              onDeletePressed();
            }}
          >
            <DeleteIcon />
            <p className="BasicMenu__label">Delete</p>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
