import { Button } from "@mui/material";
import { DocumentData } from "firebase/firestore";

import { useContext, useState } from "react";
import { UserContext } from "../lib/context";
import { firestore } from "../lib/firebase";
import { Card, CardKind } from "./Card";
import { CreateNewPost } from "./CreateNewPost";
import styles from "./Feed.module.css";

export type Post = {
  // TODO might be better type for createdAt
  createdAt: number;
  heartCount: number;
  slug: string;
  title: string;
  genre: string;
  country: string;
  // There might be a better type?
  uid: string;
  // Same as for createdAt
  updatedAt: number;
  username: string;
};

type PostFeedProps = {
  posts: DocumentData;
};

export const Feed = ({ posts }: PostFeedProps) => {
  const { username } = useContext(UserContext);
  const [createPost, setCreatePost] = useState(false);

  return (
    <>
      <Button
        size="large"
        variant="contained"
        onClick={() => setCreatePost(!createPost)}
        className={styles.button}
      >
        {createPost ? "Actually, maybe not" : "Share your band name"}
      </Button>
      {createPost && <CreateNewPost />}
      {posts && username
        ? posts.map((post: Post) => {
            const isOwner = post.username === username;
            return (
              <Card
                // TODO using slug for now but might be cleverer to use id
                key={post.slug}
                kind={CardKind.Post}
                title={post.title}
                genre={post.genre}
                country={post.country}
                username={post.username}
                isOwner={isOwner}
                postRef={firestore.doc(`posts/${post.uid}`)}
              />
            );
          })
        : null}
    </>
  );
};

export default Feed;
