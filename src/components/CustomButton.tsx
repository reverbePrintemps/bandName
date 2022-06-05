import { Typography } from "@mui/material";
import "../styles/CustomButton.css";

type CustomButtonProps = {
  type: "submit" | "button";
  label: string;
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export const CustomButton = ({
  type,
  label,
  icon,
  onClick,
  disabled,
}: CustomButtonProps) => {
  return (
    <button
      type={type}
      className="CustomButton"
      onClick={onClick}
      disabled={disabled}
    >
      {icon && (
        <img
          className="CustomButton__icon"
          src={icon}
          alt={icon}
          width={22}
          height={22}
        />
      )}
      <Typography
        fontStyle={{
          fontFamily: "monospace",
          textTransform: "uppercase",
          fontSize: "16px",
        }}
      >
        {label}
      </Typography>
    </button>
  );
};
