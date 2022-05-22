import { firestore, fromMillis, serverTimestamp } from "../lib/firebase";
import { FieldValue } from "firebase/firestore";
import kebabCase from "lodash.kebabcase";
import { AuthCheck } from "./AuthCheck";
import { Card, CardKind } from "./Card";
import { User } from "firebase/auth";
import { FormEvent } from "react";
import { Post } from "./Feed";

type CreatePostProps = {
  e: FormEvent<HTMLFormElement>;
  // TODO è__é
  // user: User | null | undefined;
  uid: string;
  slug: string;
  title: string;
  genre: string;
  country: string;
  username: string;
  createdAt: FieldValue | number;
};

export const createPost = async ({
  e,
  uid,
  slug,
  title,
  genre,
  country,
  username,
  createdAt,
}: CreatePostProps) => {
  e.preventDefault();

  // Ensure slug is URL safe
  if (!slug) {
    slug = encodeURI(kebabCase(title));
  }

  // if (!user) {
  //   return;
  // }

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

type CreateNewPostProps = {
  uid: string;
  username: string;
  cancelSubmission: () => void;
};

export const CreateNewPost = ({
  uid,
  username,
  cancelSubmission,
}: CreateNewPostProps) => {
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
        titlePlaceholder={"Enter band name"}
        genrePlaceholder={"Enter genre"}
        countryPlaceholder={"Country"}
        cancelSubmission={cancelSubmission}
        createdAt={serverTimestamp()}
      />
    </AuthCheck>
  );
};
