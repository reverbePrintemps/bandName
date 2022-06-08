import { Add } from "@mui/icons-material";
import { IconButton } from "@mui/material";

import "../styles/FloatingButton.css";

type FloatingButtonProps = {
  show: boolean;
  onClick: () => void;
};

export const FloatingButton = ({ show, onClick }: FloatingButtonProps) => {
  return (
    <div className="FloatingButton">
      {show && (
        <IconButton
          tabIndex={0}
          className="FloatingButton__icon"
          aria-label="Submit a new post"
          onClick={onClick}
        >
          <Add />
        </IconButton>
      )}
    </div>
  );
};
