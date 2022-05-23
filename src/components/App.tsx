import { firestore, fromMillis, postToJSON } from "../lib/firebase";
import { FieldValue, onSnapshot, query } from "firebase/firestore";
import { POSTS_PER_REQUEST_LIMIT } from "../lib/get-posts";
import { ScrollContainer } from "./ScrollContainer";
import { Route, Routes } from "react-router-dom";
import { UsernameForm } from "./UsernameForm";
import { Feed, FeedKind, Post } from "./Feed";
import { UserContext } from "../lib/context";
import { useEffect, useState } from "react";
import { useUserData } from "../lib/hooks";
import { Spinner } from "./Spinner";

import "../styles/App.css";

const App = () => {
  const userData = useUserData();
  const username = userData.username;
  const [posts, setPosts] = useState<Post[]>();
  const [loadMore, setLoadMore] = useState(false);
  const [cursor, setCursor] = useState<FieldValue>();
  const [reachedEnd, setReachedEnd] = useState(false);

  // TODO Simplify
  useEffect(() => {
    // Listen for any changes to the posts collection
    if (!cursor) {
      onSnapshot(
        query(
          firestore
            .collectionGroup("posts")
            .orderBy("createdAt", "desc")
            .limit(POSTS_PER_REQUEST_LIMIT)
        ),
        (querySnapshot) => {
          const posts = querySnapshot.docs.map(postToJSON);
          setPosts(posts);
        }
      );
    } else {
      // Load further posts on scroll
      loadMore &&
        posts &&
        onSnapshot(
          query(
            firestore
              .collectionGroup("posts")
              .orderBy("createdAt", "desc")
              .startAfter(cursor)
              .limit(POSTS_PER_REQUEST_LIMIT)
          ),
          (querySnapshot) => {
            const newPosts = querySnapshot.docs.map(postToJSON);
            setReachedEnd(newPosts.length < POSTS_PER_REQUEST_LIMIT);
            setPosts(posts.concat(newPosts));
          }
        );
    }
  }, [cursor, loadMore]);

  // Set cursor
  useEffect(() => {
    if (posts) {
      const last = posts[posts.length - 1];
      setCursor(
        typeof last.createdAt === "number"
          ? fromMillis(last.createdAt)
          : last.createdAt
      );
    }
  }, [posts]);

  return (
    <UserContext.Provider value={userData}>
      <div className="App">
        <ScrollContainer onLoadMore={(bool) => setLoadMore(bool)}>
          {/* When adding routes, don't forget to also add them to usernames collection in the firestore */}
          <Routes>
            <Route
              path="/"
              element={
                posts ? (
                  <Feed
                    kind={FeedKind.Public}
                    posts={posts}
                    uid={userData.user?.uid}
                    username={username}
                    reachedEnd={reachedEnd}
                  />
                ) : (
                  <Spinner />
                )
              }
            />
            <Route
              path="/:filterKind/:filter"
              element={
                posts ? (
                  <Feed
                    kind={FeedKind.Filtered}
                    posts={posts}
                    username={username}
                    reachedEnd={reachedEnd}
                  />
                ) : (
                  <Spinner />
                )
              }
            />
            <Route path="/signup" element={<UsernameForm />} />
          </Routes>
        </ScrollContainer>
      </div>
    </UserContext.Provider>
  );
};

export default App;
