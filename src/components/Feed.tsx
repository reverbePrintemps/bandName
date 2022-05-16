import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  firestore,
  fromMillis,
  getUserWithUsername,
  postToJSON,
} from "../lib/firebase";
import { Card, CardKind } from "./Card";
import { CreateNewPost } from "./CreateNewPost";
import { useParams } from "react-router-dom";

import "../styles/Feed.css";
import { useUserData } from "../lib/hooks";

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

// Max post to query per page
const POSTS_PER_REQUEST_LIMIT = 3;

const getPosts = async (
  cursor: number | undefined,
  userDoc: DocumentData | undefined
) => {
  // TODO Simplify
  const postsQuery = cursor
    ? userDoc
      ? userDoc.ref
          .collection("posts")
          .orderBy("createdAt", "desc")
          .startAfter(fromMillis(cursor))
          .limit(POSTS_PER_REQUEST_LIMIT)
      : firestore
          .collectionGroup("posts")
          .orderBy("createdAt", "desc")
          .startAfter(fromMillis(cursor))
          .limit(POSTS_PER_REQUEST_LIMIT)
    : userDoc
    ? userDoc.ref
        .collection("posts")
        .orderBy("createdAt", "desc")
        .limit(POSTS_PER_REQUEST_LIMIT)
    : firestore
        .collectionGroup("posts")
        .orderBy("createdAt", "desc")
        .limit(POSTS_PER_REQUEST_LIMIT);

  try {
    return (await postsQuery.get()).docs.map(postToJSON);
  } catch (error) {
    console.error(error);
  }
};

export const Feed = () => {
  const { urlUsername } = useParams();
  const currentlyLoggedInUser = useUserData();
  const [username, setUsername] = useState<string | undefined | null>(
    urlUsername
  );
  const [createPost, setCreatePost] = useState(false);
  const [posts, setPosts] = useState<DocumentData>();
  const [last, setLast] = useState<Post>();
  const [cursor, setCursor] = useState<number>();
  const [reachedEnd, setReachedEnd] = useState(
    posts?.length < POSTS_PER_REQUEST_LIMIT
  );
  const [loading, setLoading] = useState(false);
  const [userDoc, setUserDoc] = useState<DocumentData>();

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

  // Set username
  useEffect(() => {
    setUsername(urlUsername ?? currentlyLoggedInUser?.username);
  }, []);

  // Set userDoc
  useEffect(() => {
    if (username) {
      (async () => {
        const userDoc = await getUserWithUsername(username);
        setUserDoc(userDoc);
      })();
    }
  }, [username]);

  // Set initial posts
  useEffect(() => {
    (async () => {
      const initialPosts = await getPosts(cursor, userDoc);
      setPosts(initialPosts);
    })();
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
      <button
        className="Feed__button"
        onClick={() => setCreatePost(!createPost)}
      >
        {createPost ? "Actually, maybe not" : "Share your band name"}
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
                postRef={firestore.doc(`posts/${post.uid}`)}
              />
            );
          })
        : null}
      {!loading && !reachedEnd ? (
        <button onClick={() => getMorePosts(cursor, userDoc)}>Load more</button>
      ) : (
        !loading && "This is the end, my friend. (for now)"
      )}
    </>
  );
};
