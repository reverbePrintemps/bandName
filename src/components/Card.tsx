import firebase from "firebase/compat/app";
import { FormEvent, useEffect, useState } from "react";
import { COUNTRY_FLAGS } from "../constants/constants";
import { BasicMenu } from "./BasicMenu";
import { HeartButton } from "./HeartButton";
import { Link } from "react-router-dom";
import { CountrySelector } from "./CountrySelector";
import { Cancel } from "@mui/icons-material";
import { Button } from "@mui/material";
import { doc, deleteDoc } from "firebase/firestore";

import "../styles/Card.css";
import { firestore } from "../lib/firebase";
import toast from "react-hot-toast";

export enum CardKind {
  Post,
  Submit,
  Delete,
}

type CardKindProps =
  | {
      kind: CardKind.Post;
      title: string;
      genre: string;
      country: string;
      username: string;
      isOwner: boolean;
      postRef: firebase.firestore.DocumentReference;
      heartCount: number;
      slug: string;
      uid: string;
    }
  | {
      kind: CardKind.Submit;
      onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
      title: string;
      titlePlaceholder: string;
      onTitleChange: (e: string) => void;
      genre: string;
      genrePlaceholder: string;
      onGenreChange: (e: string) => void;
      country: string;
      countryPlaceholder: string;
      onCountryChange: (e: string) => void;
      isValid: boolean;
      username: string;
    }
  | {
      kind: CardKind.Delete;
      slug: string;
      uid: string;
    };

export const Card = (props: CardKindProps) => {
  const [cardProps, setCardProps] = useState<CardKindProps>(props);

  // If cardProps changes, update state
  useEffect(() => {
    setCardProps(props);
  }, [props]);

  const deletePost = async (uid: string, slug: string) =>
    await deleteDoc(doc(firestore, `/users/${uid}/posts`, slug));

  switch (cardProps.kind) {
    case CardKind.Post: {
      const {
        title,
        genre,
        username,
        isOwner,
        country,
        postRef,
        heartCount,
        slug,
        uid,
      } = cardProps;

      return (
        <div className="Card">
          <div className="Card__header">
            <h2 className="Card__title">{title}</h2>
            {isOwner && (
              <BasicMenu
                onDeletePressed={() =>
                  setCardProps({
                    ...props,
                    kind: CardKind.Delete,
                    slug: slug,
                    uid: uid,
                  })
                }
              />
            )}
          </div>
          <h3 className="Card__genre">{genre}</h3>
          <h3 className="Card__country">
            {COUNTRY_FLAGS.find((item) => item.name === country)?.flag ??
              country}
          </h3>
          <div className="Card__footer">
            <Link className="Card__username" to={`/${username}`}>
              <strong>u/{username}</strong>
            </Link>
            <HeartButton
              ownPost={isOwner}
              postRef={postRef}
              count={heartCount}
            />
          </div>
        </div>
      );
    }
    case CardKind.Submit: {
      const {
        onSubmit,
        title,
        genre,
        country,
        onTitleChange,
        titlePlaceholder,
        genrePlaceholder,
        onGenreChange,
        onCountryChange,
        isValid,
        countryPlaceholder,
        username,
      } = cardProps;

      return (
        <div className="Card">
          <form className="Card__form" onSubmit={onSubmit}>
            <input
              className="Card__formInput Card__title"
              value={title}
              onChange={(e) => onTitleChange(e.currentTarget.value)}
              placeholder={titlePlaceholder}
              autoFocus
            />
            <input
              className="Card__formInput Card__genre"
              value={genre}
              onChange={(e) => onGenreChange(e.currentTarget.value)}
              placeholder={genrePlaceholder}
            />
            <CountrySelector
              country={country}
              onChange={(country) => onCountryChange(country)}
              placeholder={countryPlaceholder}
            />
            <div className="Card__footer">
              <Link className="Card__username" to={`/${username}`}>
                <strong>u/{username}</strong>
              </Link>
              <button
                className="Card__button"
                type="submit"
                disabled={!isValid}
              >
                {isValid ? "🤘 Submit" : "👎 Start typin'"}
              </button>
            </div>
          </form>
        </div>
      );
    }
    case CardKind.Delete: {
      const { slug, uid } = cardProps;
      return (
        <div className="Card">
          <div className="Card__header">
            <h2 className="Card__title">Are you sure?</h2>
            <Cancel />
          </div>
          <h3 className="Card__genre">There is no turning back</h3>
          <h3 className="Card__country">(kind of)</h3>
          <div className="Card__footer">
            <Button>Turn back</Button>
            <Button
              onClick={() => {
                try {
                  deletePost(uid, slug).then(() => {
                    toast.success("Post deleted!");
                  });
                } catch (error) {
                  toast.error(
                    "There was an error deleting post, please try again later"
                  );
                }
              }}
            >
              DELET
            </Button>
          </div>
        </div>
      );
    }
  }
};
