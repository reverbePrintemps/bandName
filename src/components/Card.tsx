import { doc, deleteDoc, FieldValue } from "firebase/firestore";
import { CardButton, CardButtonKind } from "./CardButton";
import { FormEvent, useContext, useEffect, useRef, useState } from "react";
import { CountrySelector } from "./CountrySelector";
import { Cancel } from "@mui/icons-material";
import { firestore } from "../lib/firebase";
import firebase from "firebase/compat/app";
import { IconButton } from "@mui/material";
import { ClapButton } from "./ClapButton";
import { BasicMenu } from "./BasicMenu";
import { Link } from "react-router-dom";
import { ShareContext } from "../lib/context";
import toast from "react-hot-toast";

import "../styles/Card.css";

export enum CardKind {
  Post = "post",
  Submit = "submit",
  Delete = "delete",
}

type onSubmit = {
  e: FormEvent<HTMLFormElement>;
  createdAt: FieldValue | number;
} & CommonProps;

type CommonProps = {
  uid: string;
  username: string;
  slug: string;
  title: string;
  genre: string;
  country: string;
};

type CardProps =
  | ({
      kind: CardKind.Post;
      isOwner: boolean;
      // Currently a bug when converting to DocumentReference only
      postRef: firebase.firestore.DocumentReference;
      clapCount: number;
      uid: string;
      createdAt: FieldValue | number;
    } & CommonProps)
  | ({
      kind: CardKind.Submit;
      titlePlaceholder: string;
      genrePlaceholder: string;
      countryPlaceholder: string;
      createdAt: FieldValue | number;
      onSubmit: ({
        e,
        uid,
        slug,
        title,
        genre,
        country,
        username,
        createdAt,
      }: onSubmit) => void;
      onCancelSubmission: () => void;
    } & CommonProps)
  | {
      kind: CardKind.Delete;
      slug: string;
      uid: string;
    };

export const Card = (props: CardProps) => {
  const [cardProps, setCardProps] = useState<CardProps>(props);
  const titleRef = useRef<HTMLInputElement>(null);
  const { updateShareUrl } = useContext(ShareContext);

  // Setting focus manually to avoid conflicting with scroll to top
  useEffect(() => {
    setTimeout(() => {
      titleRef.current?.focus();
    }, 500);
  }, []);

  // If cardProps changes, update state
  useEffect(() => {
    setCardProps(props);
  }, [props]);

  const deletePost = async (uid: string, slug: string) =>
    await deleteDoc(doc(firestore, `/users/${uid}/posts`, slug));

  switch (cardProps.kind) {
    case CardKind.Post: {
      const {
        uid,
        slug,
        title,
        genre,
        isOwner,
        postRef,
        country,
        username,
        clapCount,
      } = cardProps;

      return (
        <div className="Card">
          <div className="Card__header">
            <h2 className="Card__title">{title}</h2>
            <BasicMenu
              isOwner={isOwner}
              onSharePressed={() =>
                updateShareUrl(`/${username}/posts/${slug}`)
              }
              onEditPressed={() => {
                setCardProps({
                  ...cardProps,
                  kind: CardKind.Submit,
                  titlePlaceholder: title,
                  genrePlaceholder: genre,
                  countryPlaceholder: country,
                  onSubmit: () => {},
                  onCancelSubmission: () => {},
                  slug,
                  username,
                });
              }}
              onDeletePressed={() =>
                setCardProps({
                  kind: CardKind.Delete,
                  slug: slug,
                  uid: uid,
                })
              }
            />
          </div>
          <h3 className="Card__genre">
            <a href={`${process.env.PUBLIC_URL}/posts/genre/${genre}`}>
              {genre}
            </a>
          </h3>
          <h3 className="Card__country">
            <a href={`${process.env.PUBLIC_URL}/posts/country/${country}`}>
              {country}
            </a>
          </h3>
          <div className="Card__footer">
            <Link className="Card__username" to={`/posts/username/${username}`}>
              <strong>u/{username}</strong>
            </Link>
            <ClapButton ownPost={isOwner} postRef={postRef} count={clapCount} />
          </div>
        </div>
      );
    }
    case CardKind.Submit: {
      const {
        uid,
        slug,
        title,
        genre,
        country,
        username,
        onSubmit,
        createdAt,
        onCancelSubmission,
        titlePlaceholder,
        genrePlaceholder,
        countryPlaceholder,
      } = cardProps;

      const isValid = title.length > 3 && title.length < 100;

      return (
        <div className="Card">
          <form
            onSubmit={(e) =>
              onSubmit({
                e,
                uid,
                slug,
                title,
                genre,
                country,
                username,
                createdAt,
              })
            }
          >
            <div className="Card__header">
              <input
                ref={titleRef}
                className="Card__formInput Card__title"
                value={title}
                onChange={(e) =>
                  setCardProps({ ...cardProps, title: e.currentTarget.value })
                }
                placeholder={titlePlaceholder}
              />
              <IconButton
                className="Card__menuIcon"
                onClick={() => {
                  // TODO Not great, but it works
                  // cancelSubmission when creating new post and setCardProps for when editing post
                  onCancelSubmission();
                  setCardProps({
                    ...props,
                  });
                }}
              >
                <Cancel />
              </IconButton>
            </div>
            <input
              className="Card__formInput Card__genre"
              value={genre}
              onChange={(e) =>
                setCardProps({ ...cardProps, genre: e.currentTarget.value })
              }
              placeholder={genrePlaceholder}
            />
            <CountrySelector
              country={country}
              onChange={(input) =>
                setCardProps({ ...cardProps, country: input })
              }
              placeholder={countryPlaceholder}
            />
            <div className="Card__footer m-submit">
              <CardButton kind={CardButtonKind.Submit} isValid={isValid} />
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
            <IconButton
              className="Card__menuIcon"
              onClick={() => {
                setCardProps({
                  ...props,
                });
              }}
            >
              <Cancel />
            </IconButton>
          </div>
          <h3 className="Card__genre">There is no turning back</h3>
          <h3 className="Card__country">🙅</h3>
          <div className="Card__footer m-submit">
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
