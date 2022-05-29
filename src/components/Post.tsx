import { firestore, postToJSON } from "../lib/firebase";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUserData } from "../lib/hooks";
import { PostType } from "./FeedContainer";
import { Card, CardKind } from "./Card";

export const Post = () => {
  const userData = useUserData();
  const { usernameParam, postId } = useParams();
  const [post, setPost] = useState<PostType>();
  const [userId, setUserId] = useState<string>();

  // TODO Extract to own function
  useEffect(() => {
    (async () => {
      firestore
        .collection("usernames")
        .doc(usernameParam)
        .get()
        .then((doc) => {
          setUserId(doc.data()?.uid);
        });
    })();
  }, [usernameParam]);

  useEffect(() => {
    (async () => {
      firestore
        .collection("users")
        .doc(userId)
        .collection("posts")
        .doc(postId)
        .get()
        .then((doc) => {
          setPost(postToJSON(doc));
        });
    })();
  }, [postId, userId]);

  if (!post) {
    return null;
  }
  const {
    uid,
    slug,
    genre,
    title,
    country,
    username,
    onSubmit,
    createdAt,
    heartCount,
    description,
    onCancelSubmission,
  } = post;

  const postRef = firestore.doc(`users/${uid}/posts/${slug}`);
  const isOwner = userData.username === username;

  return (
    <Card
      kind={CardKind.Post}
      uid={uid}
      slug={slug}
      genre={genre}
      title={title}
      isOwner={isOwner}
      postRef={postRef}
      country={country}
      username={username}
      onSubmit={onSubmit}
      createdAt={createdAt}
      clapCount={heartCount}
      description={description}
      onCancelSubmission={onCancelSubmission}
    />
  );
};
