import { DocumentData, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import { Feed, Post } from "./Feed";
import Navbar from "./Navbar";
import { UserContext } from "../lib/context";
import { firestore, fromMillis, postToJSON } from "../lib/firebase";
import { useUserData } from "../lib/hooks";
import "../styles/App.css";

// Max post to query per page
export const POSTS_PER_REQUEST_LIMIT = 3;

const getPosts = async (cursor: number | undefined) => {
  const postsQuery = cursor
    ? firestore
        .collectionGroup("posts")
        .orderBy("createdAt", "desc")
        .startAfter(fromMillis(cursor))
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

const App = () => {
  const { user, username } = useUserData();
  const [posts, setPosts] = useState<DocumentData>();
  const [last, setLast] = useState<Post>();
  const [cursor, setCursor] = useState<number>();
  const [reachedEnd, setReachedEnd] = useState(
    posts?.length < POSTS_PER_REQUEST_LIMIT
  );
  const [loading, setLoading] = useState(false);

  const getMorePosts = async (cursor: number | undefined) => {
    setLoading(true);
    const newPosts = await getPosts(cursor);
    posts && setPosts(posts.concat(newPosts));
    newPosts && setLast(newPosts[newPosts.length - 1]);
    newPosts && setReachedEnd(newPosts.length < POSTS_PER_REQUEST_LIMIT);
    last && setCursor(last.createdAt);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      const initialPosts = await getPosts(cursor);
      setPosts(initialPosts);
    })();
  }, []);

  useEffect(() => {
    if (posts) {
      setLast(posts[posts.length - 1]);
    }
  }, [posts]);

  useEffect(() => {
    if (last) {
      setCursor(last.createdAt);
    }
  }, [last]);

  if (!user) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user, username }}>
      <Navbar />
      <div className="App__container">
        <Routes>
          <Route
            path="/"
            element={
              posts && (
                <Feed
                  loading={loading}
                  reachedEnd={reachedEnd}
                  posts={posts}
                  getMorePosts={() => getMorePosts(cursor)}
                />
              )
            }
          />
        </Routes>
      </div>
    </UserContext.Provider>
  );
};

export default App;
