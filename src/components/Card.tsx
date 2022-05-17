import firebase from "firebase/compat/app";
import { Autocomplete, TextField } from "@mui/material";
import { FormEvent } from "react";
import { COUNTRIES, COUNTRY_FLAGS } from "../constants/constants";
import BasicMenu from "./BasicMenu";
import { HeartButton } from "./HeartButton";
import { Link } from "react-router-dom";
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
      onCountryChange: (e: string | null) => void;
      isValid: boolean;
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
            <HeartButton postRef={postRef} count={heartCount} />
          </div>
        </div>
      );
    }
    case CardKind.CreateNew: {
      const {
        onSubmit,
        title,
        genre,
        onTitleChange,
        titlePlaceholder,
        genrePlaceholder,
        onGenreChange,
        isValid,
        country,
        onCountryChange,
      } = props;

      return (
        <div className="Card">
          <form className="Card__form" onSubmit={onSubmit}>
            <input
              value={title}
              onChange={(e) => onTitleChange(e.currentTarget.value)}
              placeholder={titlePlaceholder}
              className="Card__title"
              autoFocus
            />
            <input
              value={genre}
              onChange={(e) => onGenreChange(e.currentTarget.value)}
              placeholder={genrePlaceholder}
              className="Card__genre"
            />
            <Autocomplete
              value={country}
              disablePortal
              options={COUNTRIES}
              sx={{ width: 200 }}
              renderInput={(params) => (
                <TextField {...params} label="Country" />
              )}
              onChange={(e) => onCountryChange(e.currentTarget.textContent)}
              className="Card__country"
            />
            <button type="submit" disabled={!isValid} className="Card__button">
              {isValid ? "BAND NAME!" : "No bueno"}
            </button>
          </form>
        </div>
      );
    }
  }
};
