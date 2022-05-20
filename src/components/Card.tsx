import toast from "react-hot-toast";
import { User } from "firebase/auth";
import { BasicMenu } from "./BasicMenu";
import { ClapButton } from "./ClapButton";
import firebase from "firebase/compat/app";
import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { firestore } from "../lib/firebase";
import { Cancel } from "@mui/icons-material";
import { createPost } from "./CreateNewPost";
import { doc, deleteDoc } from "firebase/firestore";
import { CountrySelector } from "./CountrySelector";
import { Link, useNavigate } from "react-router-dom";
import { COUNTRY_FLAGS } from "../constants/constants";
import { CardButton, CardButtonKind } from "./CardButton";

import "../styles/Card.css";

export enum CardKind {
  Post,
  Submit,
  Delete,
}

type CommonProps = {
  // TODO icky
  user: User | null | undefined;
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
      postRef: firebase.firestore.DocumentReference;
      clapCount: number;
      uid: string;
    } & CommonProps)
  | ({
      kind: CardKind.Submit;
      titlePlaceholder: string;
      genrePlaceholder: string;
      countryPlaceholder: string;
      cancelSubmission: () => void;
    } & CommonProps)
  | {
      kind: CardKind.Delete;
      slug: string;
      uid: string;
    };

export const Card = (props: CardProps) => {
  const [cardProps, setCardProps] = useState<CardProps>(props);
  const navigate = useNavigate();

  // If cardProps changes, update state
  useEffect(() => {
    setCardProps(props);
  }, [props]);

  const deletePost = async (uid: string, slug: string) =>
    await deleteDoc(doc(firestore, `/users/${uid}/posts`, slug));

  switch (cardProps.kind) {
    case CardKind.Post: {
      const {
        user,
        username,
        isOwner,
        postRef,
        clapCount,
        slug,
        uid,
        title,
        genre,
        country,
      } = cardProps;

      return (
        <div className="Card">
          <div className="Card__header">
            <h2 className="Card__title">{title}</h2>
            {isOwner && (
              <BasicMenu
                onEditPressed={() => {
                  setCardProps({
                    ...cardProps,
                    kind: CardKind.Submit,
                    titlePlaceholder: title,
                    genrePlaceholder: genre,
                    countryPlaceholder: country,
                    cancelSubmission: () => {},
                    slug,
                    user,
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
            <ClapButton ownPost={isOwner} postRef={postRef} count={clapCount} />
          </div>
        </div>
      );
    }
    case CardKind.Submit: {
      const {
        user,
        slug,
        title,
        genre,
        country,
        username,
        cancelSubmission,
        titlePlaceholder,
        genrePlaceholder,
        countryPlaceholder,
      } = cardProps;

      const isValid = title.length > 3 && title.length < 100;

      return (
        <div className="Card">
          <form
            onSubmit={(e) =>
              createPost({
                e,
                user,
                slug,
                title,
                genre,
                country,
                username,
              }).then(() => {
                toast.success("Post created!");
                setTimeout(() => {
                  navigate("/");
                }, 3000);
              })
            }
          >
            <div className="Card__header">
              <input
                className="Card__formInput Card__title"
                value={title}
                onChange={(e) =>
                  setCardProps({ ...cardProps, title: e.currentTarget.value })
                }
                placeholder={titlePlaceholder}
                autoFocus
              />
              <IconButton className="Card__menuIcon" onClick={cancelSubmission}>
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
            />
          </div>
        </div>
      );
    }
  }
};
