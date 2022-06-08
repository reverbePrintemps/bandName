import { CardButton, CardButtonKind } from "./CardButton";
import { FormEvent, useContext, useEffect, useState } from "react";
import { CardOverflowMenu } from "./CardOverflowMenu";
import { AutogrowingInput } from "./AutogrowingInput";
import { IconButton, Tooltip } from "@mui/material";
import { CountrySelector } from "./CountrySelector";
import { ShareContext } from "../lib/context";
import { Cancel } from "@mui/icons-material";
import firebase from "firebase/compat/app";
import { deletePost } from "../lib/submit";
import { ClapButton } from "./ClapButton";
import CardFlip from "react-card-flip";
import toast from "react-hot-toast";

import "../styles/Card.css";

export enum CardKind {
  Post = "post",
  Submit = "submit",
  Edit = "edit",
  Delete = "delete",
}

type onSubmit = {
  e: FormEvent<HTMLFormElement>;
} & CommonProps;

type CommonProps = {
  uid: string;
  slug: string;
  title: string;
  genre: string;
  country: string;
  username: string;
  description: string;
};

type CardProps = {
  kind: CardKind;
  isOwner: boolean;
  // Currently a bug when converting to DocumentReference only
  clapCount: number;
  createdAt: number | undefined;
  onSubmit: ({
    e,
    uid,
    slug,
    title,
    genre,
    country,
    username,
    description,
  }: onSubmit) => void;
  onCancelSubmission: () => void;
  postRef: firebase.firestore.DocumentReference | undefined;
} & CommonProps;

export const Card = (props: CardProps) => {
  const { updateShareUrl } = useContext(ShareContext);
  const [cardKind, setCardKind] = useState<CardKind>(
    props.kind || CardKind.Post
  );
  const [isFlipped, setIsFlipped] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [title, setTitle] = useState(props.title);
  const [genre, setGenre] = useState(props.genre);
  const [country, setCountry] = useState(props.country);
  const [description, setDescription] = useState(props.description);

  const shortDate =
    props.createdAt &&
    new Date(props.createdAt).toLocaleString("en-US", {
      dateStyle: "short",
    });
  const createdAtTime =
    props.createdAt && new Date(props.createdAt).toLocaleTimeString();

  useEffect(() => {
    if (title.length > 3 && title.length < 100) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [title]);

  switch (cardKind) {
    case CardKind.Post: {
      const {
        slug,
        title,
        genre,
        isOwner,
        postRef,
        country,
        username,
        clapCount,
        description,
      } = props;

      return (
        <CardFlip
          isFlipped={isFlipped}
          flipDirection="vertical"
          flipSpeedBackToFront={0.25}
          flipSpeedFrontToBack={0.25}
        >
          <div className="Card" onClick={() => setIsFlipped(!isFlipped)}>
            <div>
              <div className="Card__header">
                <h2 className="Card__title">{title}</h2>
                <CardOverflowMenu
                  isOwner={isOwner}
                  onSharePressed={() =>
                    updateShareUrl(`/${username}/posts/${slug}`)
                  }
                  onEditPressed={() => {
                    setCardKind(CardKind.Edit);
                  }}
                  onDeletePressed={() => {
                    setCardKind(CardKind.Delete);
                  }}
                />
              </div>
              <h3 className="Card__genre">
                <a
                  href={`${process.env.PUBLIC_URL}/posts/genre/${genre}`}
                  // All e.stopPropagation() are to prevent the card flip
                  onClick={(e) => e.stopPropagation()}
                >
                  {genre}
                </a>
              </h3>
              <h3 className="Card__country">
                <a
                  href={`${process.env.PUBLIC_URL}/posts/country/${country}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {country}
                </a>
              </h3>
            </div>
            <div className="Card__footer">
              <div className="Card__postedInfo">
                <a
                  className="Card__username"
                  href={`${process.env.PUBLIC_URL}/posts/username/${username}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  u/{username}
                </a>
              </div>
              {postRef && (
                <ClapButton
                  ownPost={isOwner}
                  postRef={postRef}
                  count={clapCount}
                />
              )}
            </div>
          </div>

          <div className="Card" onClick={() => setIsFlipped(!isFlipped)}>
            <div className="Card__header m-flexEnd">
              <CardOverflowMenu
                isOwner={isOwner}
                onSharePressed={() =>
                  updateShareUrl(`/${username}/posts/${slug}`)
                }
                onEditPressed={() => {
                  setCardKind(CardKind.Edit);
                }}
                onDeletePressed={() => {
                  setCardKind(CardKind.Delete);
                }}
              />
            </div>
            <div className="Card__description">
              {description ? (
                description
              ) : isOwner ? (
                <p>
                  You haven't provided a context for this{" "}
                  <span className="Globals__bandName">BandName!</span> 😕
                </p>
              ) : (
                <p>
                  No context was provided for this{" "}
                  <span className="Globals__bandName">BandName!</span> 😕
                </p>
              )}
            </div>
            <div className="Card__footer">
              <div className="Card__postedInfo">
                Posted on{" "}
                <Tooltip title={`At ${createdAtTime}`}>
                  <span className="Card__postedDate">{shortDate}</span>
                </Tooltip>
              </div>
            </div>
          </div>
        </CardFlip>
      );
    }
    case CardKind.Submit: {
      const { uid, slug, username, onSubmit, onCancelSubmission } = props;

      return (
        <form
          onSubmit={(e) => {
            onSubmit({
              e,
              uid,
              slug,
              title,
              genre,
              country,
              username,
              description,
            });
            setCardKind(CardKind.Post);
          }}
        >
          <CardFlip isFlipped={isFlipped} flipDirection="vertical">
            <div
              className="Card"
              onClick={() => isValid && setIsFlipped(!isFlipped)}
            >
              <div className="Card__header">
                <AutogrowingInput
                  autoFocus
                  className="Card__title"
                  placeholder="Enter band name"
                  onInput={(title) => setTitle(title)}
                />
                <IconButton
                  className="Card__menuIcon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelSubmission();
                  }}
                >
                  <Cancel />
                </IconButton>
              </div>
              <AutogrowingInput
                className="Card__genre"
                placeholder="Enter genre"
                onInput={(genre) => setGenre(genre)}
              />
              <CountrySelector
                placeholder="Country"
                onInput={(country) => setCountry(country)}
              />
              <div className="Card__footer m-flexEnd">
                <CardButton kind={CardButtonKind.Flip} isValid={isValid} />
              </div>
            </div>

            <div className="Card" onClick={() => setIsFlipped(!isFlipped)}>
              <div className="Card__header m-flexEnd">
                <IconButton
                  className="Card__menuIcon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancelSubmission();
                  }}
                >
                  <Cancel />
                </IconButton>
              </div>
              <AutogrowingInput
                className="Card__description"
                placeholder="Provide some context around this BandName!"
                onInput={(description) => setDescription(description)}
                rows={2}
              />
              <div className="Card__footer m-flexEnd">
                <CardButton kind={CardButtonKind.Submit} isValid={isValid} />
              </div>
            </div>
          </CardFlip>
        </form>
      );
    }
    case CardKind.Edit: {
      const { uid, slug, username, onSubmit } = props;

      return (
        <form
          onSubmit={(e) => {
            onSubmit({
              e,
              uid,
              slug,
              title,
              genre,
              country,
              username,
              description,
            });
            setCardKind(CardKind.Post);
          }}
        >
          <CardFlip isFlipped={isFlipped} flipDirection="vertical">
            <div
              className="Card"
              onClick={() => isValid && setIsFlipped(!isFlipped)}
            >
              <div className="Card__header">
                <AutogrowingInput
                  className="Card__title"
                  placeholder="Enter band name"
                  value={title}
                  onInput={(title) => setTitle(title)}
                />
                <IconButton
                  className="Card__menuIcon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCardKind(CardKind.Post);
                  }}
                >
                  <Cancel />
                </IconButton>
              </div>
              <AutogrowingInput
                className="Card__genre"
                placeholder="Genre"
                value={genre}
                onInput={(genre) => setGenre(genre)}
              />
              <CountrySelector
                placeholder="Country"
                countryFlag={country}
                onInput={(country) => setCountry(country)}
              />
              <div className="Card__footer m-flexEnd">
                <CardButton kind={CardButtonKind.Flip} isValid={isValid} />
              </div>
            </div>

            <div className="Card" onClick={() => setIsFlipped(!isFlipped)}>
              <div className="Card__header m-flexEnd">
                <IconButton
                  className="Card__menuIcon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCardKind(CardKind.Post);
                  }}
                >
                  <Cancel />
                </IconButton>
              </div>
              <AutogrowingInput
                className="Card__description"
                placeholder="Provide some context around this BandName!"
                value={description}
                onInput={(description) => setDescription(description)}
                rows={2}
              />
              <div className="Card__footer">
                <div className="Card__postedInfo">
                  Posted on{" "}
                  <Tooltip title={`At ${createdAtTime}`}>
                    <span className="Card__postedDate">{shortDate}</span>
                  </Tooltip>
                </div>
                <CardButton kind={CardButtonKind.Submit} isValid={isValid} />
              </div>
            </div>
          </CardFlip>
        </form>
      );
    }
    case CardKind.Delete: {
      const { slug, uid } = props;
      return (
        <div className="Card">
          <div className="Card__header">
            <h2 className="Card__title">Are you sure?</h2>
            <IconButton
              className="Card__menuIcon"
              onClick={(e) => {
                e.stopPropagation();
                setCardKind(CardKind.Post);
              }}
            >
              <Cancel />
            </IconButton>
          </div>
          <h3 className="Card__genre">There is no turning back</h3>
          <h3 className="Card__country">🙅</h3>
          <div className="Card__footer m-flexEnd">
            <CardButton
              kind={CardButtonKind.Action}
              label="Delete"
              onClick={() => {
                toast.promise(deletePost(uid, slug), {
                  loading: "Deleting...",
                  success: "Band name deleted successfully!",
                  error: "Woops. Something went wrong. Try again.",
                });
              }}
            />
          </div>
        </div>
      );
    }
  }
};
