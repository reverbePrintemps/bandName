import "../styles/FloatingButton.css";

type FloatingButtonProps = {
  show: boolean;
  onClick: () => void;
};

export const FloatingButton = ({ show, onClick }: FloatingButtonProps) => {
  return (
    <>
      {show && (
        <button
          tabIndex={0}
          className="FloatingButton"
          aria-label="Submit a new post"
          onClick={onClick}
        >
          +
        </button>
      )}
    </>
  );
};
