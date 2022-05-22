import { firestore, fromMillis, serverTimestamp } from "../lib/firebase";
import { FieldValue } from "firebase/firestore";
import kebabCase from "lodash.kebabcase";
import { AuthCheck } from "./AuthCheck";
import { Card, CardKind } from "./Card";
import { FormEvent } from "react";
import { Post } from "./Feed";

export type SubmitPostProps = {
  e: FormEvent<HTMLFormElement>;
  uid: string;
  username: string;
  slug: string;
  title: string;
  genre: string;
  country: string;
  createdAt: FieldValue | number;
};

export const submitPost = async ({
  e,
  uid,
  slug,
  title,
  genre,
  country,
  username,
  createdAt,
}: SubmitPostProps) => {
  e.preventDefault();

  // Ensure slug is URL safe
  if (!slug) {
    slug = encodeURI(kebabCase(title));
  }

  // const uid = user.uid;
  const ref = firestore
    .collection("users")
    .doc(uid)
    .collection("posts")
    .doc(slug);

  // Tip: give all fields a default value here
  // If post already exists, update it
  if (typeof createdAt === "number") {
    const data = {
      title,
      genre,
      country,
      slug,
      createdAt: fromMillis(createdAt),
      updatedAt: serverTimestamp(),
    };
    await ref.update(data);
  } else {
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
  }
};

type SubmitPostCardProps = {
  uid: string;
  username: string;
  onSubmit: ({
    e,
    uid,
    slug,
    title,
    genre,
    country,
    username,
    createdAt,
  }: SubmitPostProps) => void;

  onCancelSubmission: () => void;
};

export const SubmitPostCard = ({
  uid,
  username,
  onSubmit,
  onCancelSubmission,
}: SubmitPostCardProps) => {
  return (
    <AuthCheck>
      <Card
        kind={CardKind.Submit}
        uid={uid}
        username={username}
        slug={""}
        title={""}
        genre={""}
        country={""}
        createdAt={serverTimestamp()}
        countryPlaceholder={"Country"}
        genrePlaceholder={"Enter genre"}
        titlePlaceholder={"Enter band name"}
        onSubmit={onSubmit}
        onCancelSubmission={onCancelSubmission}
      />
    </AuthCheck>
  );
};
