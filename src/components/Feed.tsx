import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore, getUserWithUsername } from "../lib/firebase";
import { Card, CardKind } from "./Card";
import { CreateNewPost } from "./CreateNewPost";
import { useUserData } from "../lib/hooks";
import { getPosts, POSTS_PER_REQUEST_LIMIT } from "../lib/get-posts";
import { Spinner } from "./Spinner";

import "../styles/Feed.css";

export type Post = {
  // TODO might be better type for createdAt
  createdAt: number;
  heartCount: number;
  slug: string;
  title: string;
  genre: string;
  country: string;
  // Same as for createdAt
  updatedAt: number;
  username: string;
};

export const Feed = () => {
  const currentlyLoggedInUser = useUserData();
  const [createPost, setCreatePost] = useState(false);
  const [posts, setPosts] = useState<DocumentData>();
  const [last, setLast] = useState<Post>();
  const [reachedEnd, setReachedEnd] = useState(true);
  const [loading, setLoading] = useState<boolean>();

  const getMorePosts = async (last: Post | undefined) => {
    const cursor = last?.createdAt;
    const newPosts = await getPosts(cursor);
    posts && setPosts(posts.concat(newPosts));
    newPosts && setReachedEnd(newPosts.length < POSTS_PER_REQUEST_LIMIT);
  };

  // Set initial posts
  useEffect(() => {
    setLoading(true);
    (async () => {
      const initialPosts = await getPosts();
      setPosts(initialPosts);
      setLoading(false);
    })();
  }, []);

  // Set last
  useEffect(() => {
    if (posts) {
      setLast(posts[posts.length - 1]);
    }
  }, [posts]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <button
        className="Feed__button"
        onClick={() => setCreatePost(!createPost)}
      >
        {!loading && createPost
          ? "Actually, maybe not"
          : "Share your band name"}
      </button>
      {createPost && <CreateNewPost />}
      {posts
        ? posts.map((post: Post) => {
            const isOwner = post.username === currentlyLoggedInUser.username;
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
                postRef={firestore.doc(`posts/${post.slug}`)}
                heartCount={post.heartCount}
              />
            );
          })
        : null}
      {!loading && !reachedEnd ? (
        <button className="Feed__button" onClick={() => getMorePosts(last)}>
          Load more
        </button>
      ) : (
        !loading && "This is the end, my friend. (for now)"
      )}
    </>
  );
};
