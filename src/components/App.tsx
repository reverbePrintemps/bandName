import { firestore, postToJSON } from "../lib/firebase";
import { FeedContainer, FeedKind, PostType } from "./FeedContainer";
import { DocumentData, getDocs, onSnapshot, query } from "firebase/firestore";
import { POSTS_PER_REQUEST_LIMIT } from "../lib/get-posts";
import { ShareContext, UserContext } from "../lib/context";
import { ScrollContainer } from "./ScrollContainer";
import { SinglePostPage } from "./SinglePostPage";
import { Route, Routes } from "react-router-dom";
import { UsernameForm } from "./UsernameForm";
import { useEffect, useState } from "react";
import { ShareDrawer } from "./ShareDrawer";
import { useUserData } from "../lib/hooks";
import { Spinner } from "./Spinner";

import "../styles/App.css";

const App = () => {
  const userData = useUserData();
  const [loadMore, setLoadMore] = useState(false);
  const [shareUrl, updateShareUrl] = useState("");
  const [posts, setPosts] = useState<DocumentData[]>();
  const [mappedPosts, setMappedPosts] = useState<PostType[]>();
  const shareContext = { shareUrl, updateShareUrl };
  const [cursor, setCursor] = useState<DocumentData>();
  const [reachedEndOfPosts, setReachedEndOfPosts] = useState(false);
  const [showShareDrawer, setShowShareDrawer] = useState(false);
  const [orderBy, setOrderBy] = useState<"createdAt" | "heartCount">(
    "createdAt"
  );
  const [last, setLast] = useState<DocumentData>();

  useEffect(() => {
    // TODO Not gr8
    if (shareUrl !== "") {
      setShowShareDrawer(true);
    }
  }, [shareUrl]);

  // TODO Extract to own functions
  useEffect(() => {
    if (!cursor) {
      // Listen for any changes to the posts collection
      const unsubscribe = onSnapshot(
        query(
          firestore
            .collectionGroup("posts")
            .orderBy(orderBy, "desc")
            .limit(POSTS_PER_REQUEST_LIMIT)
        ),
        (querySnapshot) => {
          const posts = querySnapshot.docs;
          setReachedEndOfPosts(posts.length < POSTS_PER_REQUEST_LIMIT);
          setPosts(posts);
        }
      );
      return unsubscribe;
    }
  }, [cursor, orderBy]);

  useEffect(() => {
    // Load further posts on scroll
    if (cursor) {
      const unsubscribe = onSnapshot(
        query(
          firestore
            .collectionGroup("posts")
            .orderBy(orderBy, "desc")
            .startAfter(cursor)
            .limit(POSTS_PER_REQUEST_LIMIT)
        ),
        (querySnapshot) => {
          if (loadMore && posts) {
            const newPosts = querySnapshot.docs;
            setReachedEndOfPosts(newPosts.length < POSTS_PER_REQUEST_LIMIT);
            setPosts(posts.concat(newPosts));
          }
        }
      );
      // Cleanup so listener can get fresh values for loadMore and posts
      return unsubscribe;
    }
  }, [loadMore, orderBy, cursor]);

  useEffect(() => {
    if (posts) {
      setLast(posts[posts.length - 1]);
      setMappedPosts(posts.map((post) => postToJSON(post)));
    }
  }, [posts]);

  useEffect(() => {
    setCursor(last);
  }, [last]);

  // Reset cursor on orderBy change
  useEffect(() => {
    setCursor(undefined);
  }, [orderBy]);

  return (
    <UserContext.Provider value={userData}>
      <ShareContext.Provider value={shareContext}>
        <div className="App">
          <ScrollContainer
            posts={mappedPosts}
            reachedEndOfPosts={reachedEndOfPosts}
            onLoadMore={(bool) => setLoadMore(bool)}
          >
            {/* When adding routes, don't forget to also add them to usernames collection in the firestore */}
            <Routes>
              <Route
                path="/"
                element={
                  mappedPosts ? (
                    <FeedContainer
                      kind={FeedKind.Public}
                      posts={mappedPosts}
                      uid={userData.user?.uid}
                      username={userData.username}
                      reachedEnd={reachedEndOfPosts}
                      onSortPressed={(orderBy) => setOrderBy(orderBy)}
                      orderBy={orderBy}
                    />
                  ) : (
                    <Spinner />
                  )
                }
              />
              <Route
                path="/posts/:filterKind/:filter"
                element={
                  mappedPosts ? (
                    <FeedContainer
                      kind={FeedKind.Filtered}
                      posts={mappedPosts}
                      username={userData.username}
                      reachedEnd={reachedEndOfPosts}
                      onSortPressed={(orderBy) => setOrderBy(orderBy)}
                      orderBy={orderBy}
                    />
                  ) : (
                    <Spinner />
                  )
                }
              />
              <Route
                path="/signup"
                element={<UsernameForm userData={userData} />}
              />
              <Route
                path="/:usernameParam/posts/:postId"
                element={<SinglePostPage />}
              />
            </Routes>
          </ScrollContainer>
          <ShareDrawer
            shareUrl={shareUrl}
            open={showShareDrawer}
            onClose={() => {
              updateShareUrl("");
              setShowShareDrawer(false);
            }}
          />
        </div>
      </ShareContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
