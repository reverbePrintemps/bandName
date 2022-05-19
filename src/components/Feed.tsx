import { DocumentData, FieldValue } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore } from "../lib/firebase";
import { Card, CardKind } from "./Card";
import { CreateNewPost } from "./CreateNewPost";
import { useUserData } from "../lib/hooks";
import { getPosts, POSTS_PER_REQUEST_LIMIT } from "../lib/get-posts";
import { Spinner } from "./Spinner";

import "../styles/Feed.css";

export type Post = {
  // TODO might be better type for createdAt
  createdAt: FieldValue;
  heartCount: number;
  slug: string;
  title: string;
  genre: string;
  country: string;
  uid: string;
  // Same as for createdAt
  updatedAt: FieldValue;
  username: string;
};

type FeedProps = {
  initialPosts: DocumentData;
};

export const Feed = ({ initialPosts }: FeedProps) => {
  const currentlyLoggedInUser = useUserData();
  const username = currentlyLoggedInUser.username;
  const [createPost, setCreatePost] = useState(false);
  const [posts, setPosts] = useState<DocumentData>(initialPosts);
  const [last, setLast] = useState<Post>(posts[posts.length - 1]);
  const [reachedEnd, setReachedEnd] = useState(true);
  const [loading, setLoading] = useState<boolean>();

  const getMorePosts = async (last: Post) => {
    const cursor = last.createdAt;
    const newPosts = await getPosts(cursor);
    posts && setPosts(posts.concat(newPosts));
    newPosts && setReachedEnd(newPosts.length < POSTS_PER_REQUEST_LIMIT);
  };

  // Set last
  useEffect(() => {
    if (posts) {
      setLast(posts[posts.length - 1]);
    }
  }, [posts]);

  // Trigger rerender when username changes
  useEffect(() => {
    if (username) {
      setPosts(posts);
    }
  }, [username]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="Feed">
      <button
        className="Feed__button"
        onClick={() => setCreatePost(!createPost)}
      >
        {!loading && createPost
          ? "Actually, maybe not"
          : "Share your band name"}
      </button>
      {createPost && currentlyLoggedInUser && (
        <CreateNewPost user={currentlyLoggedInUser} />
      )}
      {posts
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
                heartCount={post.heartCount}
                slug={post.slug}
                isOwner={isOwner}
                uid={post.uid}
                postRef={firestore.doc(`users/${post.uid}/posts/${post.slug}`)}
              />
            );
          })
        : null}
      {!loading && !reachedEnd ? (
        <button className="Feed__button" onClick={() => getMorePosts(last)}>
          Load more
        </button>
      ) : (
        !loading && (
          <span className="Feed__footerMessage">
            This is the end, my friend. (for now)
          </span>
        )
      )}
    </div>
  );
};
