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
  const { genre, country, title, username, heartCount, uid, slug } = post;

  const postRef = firestore.doc(`users/${uid}/posts/${slug}`);
  const isOwner = userData.username === username;

  return (
    <Card
      kind={CardKind.Post}
      isOwner={isOwner}
      postRef={postRef}
      clapCount={heartCount}
      uid={uid}
      createdAt={post.createdAt}
      genre={genre}
      country={country}
      title={title}
      username={username}
      slug={slug}
    />
  );
};
