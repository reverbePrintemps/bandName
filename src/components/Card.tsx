import firebase from "firebase/compat/app";
import { FormEvent } from "react";
import { COUNTRY_FLAGS } from "../constants/constants";
import BasicMenu from "./BasicMenu";
import { HeartButton } from "./HeartButton";
import { Link } from "react-router-dom";
import { CountrySelector } from "./CountrySelector";

import "../styles/Card.css";

export enum CardKind {
  Post,
  CreateNew,
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
    }
  | {
      kind: CardKind.CreateNew;
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
      username: string | null;
    };

export const Card = (props: CardKindProps) => {
  switch (props.kind) {
    case CardKind.Post: {
      const { title, genre, username, isOwner, country, postRef, heartCount } =
        props;
      return (
        <div className="Card">
          <div className="Card__header">
            <h2 className="Card__title">{title}</h2>
            {isOwner && <BasicMenu />}
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
    case CardKind.CreateNew: {
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
      } = props;

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
                type="submit"
                disabled={!isValid}
                className="Card__button"
              >
                {isValid ? "BAND NAME!" : "No bueno"}
              </button>
            </div>
          </form>
        </div>
      );
    }
  }
};
