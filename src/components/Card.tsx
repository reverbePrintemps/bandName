import firebase from "firebase/compat/app";
import { Autocomplete, Button, TextField } from "@mui/material";
import { FormEvent } from "react";
import { COUNTRIES, COUNTRY_FLAGS } from "../constants/constants";
import BasicMenu from "./BasicMenu";
import styles from "./Card.module.css";
import { Heart } from "./HeartButton";
import { Link } from "react-router-dom";

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
      const { title, genre, username, isOwner, country, postRef } = props;
      return (
        <div className={styles.container}>
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            {isOwner && <BasicMenu />}
          </div>
          <h3 className={styles.genre}>{genre}</h3>
          <h3 className={styles.country}>
            {COUNTRY_FLAGS.find((item) => item.name === country)?.flag ??
              country}
          </h3>
          <div className={styles.footer}>
            <Link to={`/${username}`}>
              <strong>u/{username}</strong>
            </Link>
            <Heart postRef={postRef} />
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
        <div className={styles.container}>
          <form className={styles.form} onSubmit={onSubmit}>
            <input
              value={title}
              onChange={(e) => onTitleChange(e.currentTarget.value)}
              placeholder={titlePlaceholder}
              className={styles.title}
              autoFocus
            />
            <input
              value={genre}
              onChange={(e) => onGenreChange(e.currentTarget.value)}
              placeholder={genrePlaceholder}
              className={styles.genre}
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
              className={styles.country}
            />
            <Button
              variant="contained"
              size="large"
              type="submit"
              disabled={!isValid}
              className={styles.button}
            >
              {isValid ? "BAND NAME!" : "You can do better than that"}
            </Button>
          </form>
        </div>
      );
    }
  }
};
