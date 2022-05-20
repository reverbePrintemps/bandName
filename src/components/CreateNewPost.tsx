import kebabCase from "lodash.kebabcase";
import { firestore, serverTimestamp } from "../lib/firebase";
import { FormEvent, useState } from "react";
import { AuthCheck } from "./AuthCheck";
import { Card, CardKind } from "./Card";
import { Post } from "./Feed";
import { User } from "firebase/auth";

type CreatePostProps = {
  e: FormEvent<HTMLFormElement>;
  // TODO è__é
  user: User | null | undefined;
  slug: string;
  title: string;
  genre: string;
  country: string;
  username: string;
};

export const createPost = async ({
  e,
  user,
  slug,
  title,
  genre,
  country,
  username,
}: CreatePostProps) => {
  e.preventDefault();

  // Ensure slug is URL safe
  if (!slug) {
    slug = encodeURI(kebabCase(title));
  }

  if (!user) {
    return;
  }

  const uid = user.uid;
  const ref = firestore
    .collection("users")
    .doc(uid)
    .collection("posts")
    .doc(slug);

  // Tip: give all fields a default value here
  const data: Post = {
    title,
    genre,
    country,
    slug,
    uid,
    username,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    heartCount: 0,
  };

  await ref.set(data);
};

type CreateNewPostProps = {
  user: User;
  username: string;
};

export const CreateNewPost = ({ user, username }: CreateNewPostProps) => {
  return (
    <AuthCheck>
      <Card
        kind={CardKind.Submit}
        user={user}
        username={username}
        slug={""}
        // TODO Not sure
        title={""}
        genre={""}
        country={""}
        titlePlaceholder={"Enter band name"}
        genrePlaceholder={"Enter genre"}
        countryPlaceholder={"Country"}
      />
    </AuthCheck>
  );
};
