import { DocumentData } from "firebase/firestore";
import { useContext, useState } from "react";
import { UserContext } from "../lib/context";
import { firestore } from "../lib/firebase";
import { Card, CardKind } from "./Card";
import { CreateNewPost } from "./CreateNewPost";

import "../styles/Feed.css";

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
  loading: boolean;
  reachedEnd: boolean;
  posts: DocumentData;
  getMorePosts: () => void;
};

export const Feed = ({
  posts,
  getMorePosts,
  loading,
  reachedEnd,
}: PostFeedProps) => {
  const { username } = useContext(UserContext);
  const [createPost, setCreatePost] = useState(false);

  return (
    <>
      <button
        className="Feed__button"
        onClick={() => setCreatePost(!createPost)}
      >
        {createPost ? "Actually, maybe not" : "Share your band name"}
      </button>
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
      {!loading && !reachedEnd ? (
        <button onClick={getMorePosts}>Load more</button>
      ) : (
        !loading && "This is the end, my friend. (for now)"
      )}
    </>
  );
};
