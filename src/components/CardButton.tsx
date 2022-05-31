import { Refresh } from "@mui/icons-material";
import "../styles/CardButton.css";

export enum CardButtonKind {
  Submit,
  Action,
  Flip,
}

type CardButtonProps =
  | {
      kind: CardButtonKind.Submit;
      isValid: boolean;
    }
  | {
      kind: CardButtonKind.Action;
      label: string;
      onClick: () => void;
    }
  | {
      kind: CardButtonKind.Flip;
      isValid: boolean;
    };

export const CardButton = (props: CardButtonProps) => {
  switch (props.kind) {
    case CardButtonKind.Flip: {
      const { isValid } = props;
      return (
        <button
          className="CardButton m-flip"
          disabled={!isValid}
          onClick={(e) => e.preventDefault()}
        >
          {isValid ? (
            <>
              <Refresh sx={{ color: "var(--button-text)" }} />
              <span className="CardButton__text">Flip</span>
            </>
          ) : (
            <>
              👎
              <span className="CardButton__text">Start typin'</span>
            </>
          )}
        </button>
      );
    }
    case CardButtonKind.Submit: {
      const { isValid } = props;
      return (
        <button type="submit" className="CardButton" disabled={!isValid}>
          {isValid ? (
            <>
              🤘
              <span className="CardButton__text">Submit</span>
            </>
          ) : (
            <>
              👎
              <span className="CardButton__text">Start typin'</span>
            </>
          )}
        </button>
      );
    }
    case CardButtonKind.Action: {
      const { onClick, label } = props;
      return (
        <button className="CardButton m-delete" onClick={onClick}>
          {label}
        </button>
      );
    }
  }
};
