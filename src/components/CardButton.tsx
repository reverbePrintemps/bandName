import "../styles/CardButton.css";

export enum CardButtonKind {
  Submit,
  Action,
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
    };

export const CardButton = (props: CardButtonProps) => {
  switch (props.kind) {
    case CardButtonKind.Submit: {
      const { isValid } = props;
      return (
        <button
          className="CardButton m-submit"
          type="submit"
          disabled={!isValid}
        >
          {isValid ? "🤘 Submit" : "👎 Start typin'"}
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
