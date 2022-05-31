import { Add } from "@mui/icons-material";
import { IconButton } from "@mui/material";

type FloatingButtonProps = {
  show: boolean;
  onClick: () => void;
};

export const FloatingButton = ({ show, onClick }: FloatingButtonProps) => {
  return (
    <>
      {show && (
        <IconButton
          tabIndex={0}
          className="FloatingButton"
          aria-label="Submit a new post"
          onClick={onClick}
          style={{
            position: "fixed",
            bottom: "16px",
            zIndex: "99",
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            fontSize: "24px",
            backgroundColor: "var(--button-bg)",
            color: "var(--button-text)",
            alignSelf: "flex-end",
          }}
        >
          <Add />
        </IconButton>
      )}
    </>
  );
};
