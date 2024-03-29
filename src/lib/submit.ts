import { doc, deleteDoc, FieldValue } from "firebase/firestore";
import { firestore, serverTimestamp } from "../lib/firebase";
import { isProfane } from "./nsfw-filter";
import kebabCase from "lodash.kebabcase";
import { FormEvent } from "react";

export const deletePost = async (uid: string, slug: string) =>
  await deleteDoc(doc(firestore, `/users/${uid}/posts`, slug));

// So far unused
export const deleteComment = async (
  uid: string,
  postId: string,
  commentId: string
) =>
  await deleteDoc(
    doc(firestore, `/users/${uid}/posts/${postId}/comments/`, commentId)
  );

export type EditPostProps = {
  e: FormEvent<HTMLFormElement>;
  uid: string;
  username: string;
  slug: string;
  title: string;
  genre: string;
  country: string;
  description: string;
};

type EditPostData = {
  title: string;
  genre: string;
  nsfw: boolean;
  country: string;
  description: string;
  updatedAt: FieldValue;
};

export const editPost = async ({
  e,
  uid,
  slug,
  title,
  genre,
  country,
  description,
}: EditPostProps) => {
  e.preventDefault();

  const isNSFW = isProfane(title) || isProfane(genre) || isProfane(description);

  // const uid = user.uid;
  const ref = firestore
    .collection("users")
    .doc(uid)
    .collection("posts")
    .doc(slug);

  // Tip: give all fields a default value here
  const data: EditPostData = {
    title,
    genre,
    country,
    nsfw: isNSFW,
    // TODO Migrate posts to all have empty description field
    // description field was introduced later, so it might not exist on older posts
    description: description || "",
    updatedAt: serverTimestamp(),
  };

  await ref.update(data);
};

export type CreatePostProps = {
  e: FormEvent<HTMLFormElement>;
  uid: string;
  username: string;
  title: string;
  genre: string;
  country: string;
  description: string;
};

type CreatePostData = {
  uid: string;
  slug: string;
  nsfw: boolean;
  title: string;
  genre: string;
  country: string;
  username: string;
  heartCount: number;
  description: string;
  createdAt: FieldValue;
  updatedAt: FieldValue;
};

export const createPost = async ({
  e,
  uid,
  title,
  genre,
  country,
  username,
  description,
}: CreatePostProps) => {
  e.preventDefault();

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  const isNSFW = isProfane(title) || isProfane(genre) || isProfane(description);

  // const uid = user.uid;
  const ref = firestore
    .collection("users")
    .doc(uid)
    .collection("posts")
    .doc(slug);

  // Tip: give all fields a default value here
  const data: CreatePostData = {
    title,
    genre,
    country,
    slug,
    uid,
    username,
    description,
    nsfw: isNSFW,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    heartCount: 0,
  };

  await ref.set(data);
};
