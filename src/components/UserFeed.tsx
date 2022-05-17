import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { firestore, getUserWithUsername } from "../lib/firebase";
import { Card, CardKind } from "./Card";
import { useParams } from "react-router-dom";
import { doesUserExist, useUserData } from "../lib/hooks";
import { POSTS_PER_REQUEST_LIMIT, getPosts } from "../lib/get-posts";
import { Custom404 } from "./404";
import UserProfile from "./UserProfile";
import { Post } from "./Feed";

import "../styles/UserFeed.css";
import { Spinner } from "./Spinner";

export const UserFeed = () => {
  const { urlUsername } = useParams();
  const currentlyLoggedInUser = useUserData();
  const [posts, setPosts] = useState<DocumentData>();
  const [last, setLast] = useState<Post>();
  const [cursor, setCursor] = useState<number>();
  const [reachedEnd, setReachedEnd] = useState(
    posts?.length < POSTS_PER_REQUEST_LIMIT
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [userDoc, setUserDoc] = useState<DocumentData>();
  const [userExists, setUserExists] = useState<boolean>();

  const isUserProfile = currentlyLoggedInUser.username === urlUsername;

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
    setLoading(true);
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
      setLoading(false);
    }
  }, [posts]);

  // Set cursor
  useEffect(() => {
    if (last) {
      setCursor(last.createdAt);
    }
  }, [last]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      {isUserProfile && <UserProfile user={currentlyLoggedInUser} />}
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
              postRef={firestore.doc(`posts/${post.slug}`)}
              heartCount={post.heartCount}
            />
          );
        })}
      {userExists ? (
        !loading && !reachedEnd ? (
          <button
            className="UserFeed__button"
            onClick={() => getMorePosts(cursor, userDoc)}
          >
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
