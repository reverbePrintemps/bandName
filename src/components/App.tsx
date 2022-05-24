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
  console.log("reachedEnd", reachedEnd);

  const [orderBy, setOrderBy] = useState<"createdAt" | "heartCount">(
    "createdAt"
  );
  console.log("orderBy", orderBy);

  // TODO Simplify

  useEffect(() => {
    // Load further posts on scroll
    if (!cursor) {
      console.log("here1");

      onSnapshot(
        query(
          firestore
            .collectionGroup("posts")
            .orderBy(orderBy, "desc")
            .limit(POSTS_PER_REQUEST_LIMIT)
        ),
        (querySnapshot) => {
          const posts = querySnapshot.docs.map(postToJSON);
          setPosts(posts);
        }
      );
    } else {
      console.log("here2");
      !reachedEnd &&
        loadMore &&
        posts &&
        onSnapshot(
          query(
            firestore
              .collectionGroup("posts")
              .orderBy(orderBy, "desc")
              .startAfter(cursor)
              .limit(POSTS_PER_REQUEST_LIMIT)
          ),
          (querySnapshot) => {
            const newPosts = querySnapshot.docs.map(postToJSON);
            console.log("newPosts", newPosts);

            setReachedEnd(newPosts.length < POSTS_PER_REQUEST_LIMIT);
            setPosts(posts.concat(newPosts));
          }
        );
    }
  }, [loadMore, orderBy, reachedEnd, cursor]);

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
        <ScrollContainer
          reachedEnd={reachedEnd}
          onLoadMore={(bool) => setLoadMore(bool)}
        >
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
                    onSortPressed={(orderBy) => {
                      setOrderBy(orderBy);
                    }}
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
                    onSortPressed={(orderBy) => {
                      setOrderBy(orderBy);
                    }}
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
