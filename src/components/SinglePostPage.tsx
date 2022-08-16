import { useNavigate, useParams } from "react-router-dom";
import { firestore, postToJSON } from "../lib/firebase";
import { onSnapshot, query } from "firebase/firestore";
import { CommentsSection } from "./CommentsSection";
import { useEffect, useState } from "react";
import { useUserData } from "../lib/hooks";
import { PostType } from "./FeedContainer";
import { Card, CardKind } from "./Card";

import "../styles/SinglePostPage.css";

export const SinglePostPage = () => {
  const userData = useUserData();
  const { usernameParam, postId } = useParams();
  const [post, setPost] = useState<PostType>();
  const navigate = useNavigate();

  useEffect(() => {
    onSnapshot(
      query(
        firestore.collectionGroup("posts").where("slug", "==", postId).limit(1)
      ),
      (snapshot) => {
        if (snapshot.docs.length === 0) {
          navigate("/");
        }
        const post = postToJSON(snapshot.docs[0]);
        setPost(post);
      }
    );
  }, [postId]);

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
    <div className="SinglePostPage">
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
      <CommentsSection postRef={postRef} />
    </div>
  );
};
