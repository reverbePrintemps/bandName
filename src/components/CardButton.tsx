import { MouseEvent, TouchEvent, useState } from "react";
import { Refresh } from "@mui/icons-material";
import { useNavigate } from "react-router";
import firebase from "firebase/compat/app";

import "../styles/CardButton.css";

export enum CardButtonKind {
  Submit,
  Delete,
  Clap,
  Flip,
  Comment,
}

type CommonProps = {
  children?: React.ReactNode;
};

type CardButtonProps =
  | {
      kind: CardButtonKind.Flip;
      isValid: boolean;
    }
  | {
      kind: CardButtonKind.Submit;
      isValid: boolean;
    }
  | {
      kind: CardButtonKind.Delete;
      onClick: () => void;
    }
  | ({
      kind: CardButtonKind.Clap;
      disabled?: boolean;
      onClick: (event: MouseEvent | TouchEvent) => void;
    } & CommonProps)
  | ({
      kind: CardButtonKind.Comment;
      postRef: firebase.firestore.DocumentReference | undefined;
      username: string;
    } & CommonProps);

export const CardButton = (props: CardButtonProps) => {
  const [shrink, setShrink] = useState(false);

  const navigate = useNavigate();

  const shrinkButton = () => {
    setShrink(true);
  };

  const unshrinkButton = () => {
    setShrink(false);
  };

  switch (props.kind) {
    case CardButtonKind.Flip: {
      const { isValid } = props;
      return (
        <button
          className={`CardButton m-flip ${shrink ? "m-shrink" : ""}`}
          disabled={!isValid}
          onClick={(e) => {
            e.preventDefault();
          }}
          onMouseDown={() => shrinkButton()}
          onTouchStart={() => shrinkButton()}
          onMouseUp={() => unshrinkButton()}
          onTouchEnd={() => unshrinkButton()}
        >
          {isValid ? (
            <>
              <Refresh sx={{ color: "var(--button-text)" }} />
              <span className="CardButton__text">Flip card</span>
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
        <button
          type="submit"
          className={`CardButton ${shrink ? "m-shrink" : ""}`}
          disabled={!isValid}
          onMouseDown={() => shrinkButton()}
          onTouchStart={() => shrinkButton()}
          onMouseUp={() => unshrinkButton()}
          onTouchEnd={() => unshrinkButton()}
        >
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
    case CardButtonKind.Clap: {
      const { onClick, disabled, children } = props;
      return (
        <button
          className={`CardButton m-clap ${disabled ? "m-disabled" : ""} ${
            shrink ? "m-shrink" : ""
          }`}
          onClick={onClick}
          onMouseDown={() => shrinkButton()}
          onTouchStart={() => shrinkButton()}
          onMouseUp={() => unshrinkButton()}
          onTouchEnd={() => unshrinkButton()}
        >
          {children}
        </button>
      );
    }
    case CardButtonKind.Delete: {
      const { onClick } = props;
      return (
        <button
          className={`CardButton m-delete ${shrink ? "m-shrink" : ""}`}
          onClick={onClick}
          onMouseDown={() => shrinkButton()}
          onTouchStart={() => shrinkButton()}
          onMouseUp={() => unshrinkButton()}
          onTouchEnd={() => unshrinkButton()}
        >
          🗑 Delete
        </button>
      );
    }
    case CardButtonKind.Comment: {
      const { children, username, postRef } = props;
      return (
        <button
          className={`CardButton m-comment ${shrink ? "m-shrink" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate(`/${username}/posts/${postRef?.id}`);
          }}
          onMouseDown={() => shrinkButton()}
          onTouchStart={() => shrinkButton()}
          onMouseUp={() => unshrinkButton()}
          onTouchEnd={() => unshrinkButton()}
        >
          {children}
        </button>
      );
    }
  }
};
