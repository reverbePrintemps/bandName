import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore, getUserWithUsername } from "../lib/firebase";
import { Card, CardKind } from "./Card";
import { useParams } from "react-router-dom";
import { doesUserExist, useUserData } from "../lib/hooks";
import { POSTS_PER_REQUEST_LIMIT, getPosts } from "../lib/get-posts";

import "../styles/Feed.css";
import { Custom404 } from "./404";

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

export const UserFeed = () => {
  const { urlUsername } = useParams();
  const currentlyLoggedInUser = useUserData();
  const [posts, setPosts] = useState<DocumentData>();
  const [last, setLast] = useState<Post>();
  const [cursor, setCursor] = useState<number>();
  const [reachedEnd, setReachedEnd] = useState(
    posts?.length < POSTS_PER_REQUEST_LIMIT
  );
  const [loading, setLoading] = useState(false);
  const [userDoc, setUserDoc] = useState<DocumentData>();
  const [userExists, setUserExists] = useState<boolean>();

  const getMorePosts = async (
    cursor: number | undefined,
    userDoc?: DocumentData
  ) => {
    setLoading(true);
    const newPosts = await getPosts(cursor, userDoc);
    posts && setPosts(posts.concat(newPosts));
    newPosts && setReachedEnd(newPosts.length < POSTS_PER_REQUEST_LIMIT);
    setLoading(false);
  };

  useEffect(() => {
    if (urlUsername) {
      (async () => {
        const userExists = await doesUserExist(urlUsername);
        setUserExists(userExists);
      })();
    }
  }, [urlUsername]);

  // Set userDoc
  useEffect(() => {
    if (urlUsername) {
      (async () => {
        const userDoc = await getUserWithUsername(urlUsername);
        setUserDoc(userDoc);
      })();
    }
  }, [urlUsername]);

  // Set initial posts
  useEffect(() => {
    if (userDoc) {
      (async () => {
        const initialPosts = await getPosts(cursor, userDoc);
        setPosts(initialPosts);
      })();
    }
  }, [userDoc]);

  // Set last
  useEffect(() => {
    if (posts) {
      setLast(posts[posts.length - 1]);
    }
  }, [posts]);

  // Set cursor
  useEffect(() => {
    if (last) {
      setCursor(last.createdAt);
    }
  }, [last]);

  return (
    <>
      {posts &&
        posts.map((post: Post) => {
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
              postRef={firestore.doc(`posts/${post.uid}`)}
            />
          );
        })}
      {userExists ? (
        !loading && !reachedEnd ? (
          <button onClick={() => getMorePosts(cursor, userDoc)}>
            Load more
          </button>
        ) : (
          !loading && "This is the end, my friend. (for now)"
        )
      ) : (
        <Custom404 itemNotFound="user" />
      )}
    </>
  );
};

// {!loading && !reachedEnd ? (
//   <button onClick={() => getMorePosts(cursor, userDoc)}>Load more</button>
// ) : (
//   !loading && "This is the end, my friend. (for now)"
// )}
