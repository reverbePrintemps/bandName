import { firestore, fromMillis, postToJSON } from "../lib/firebase";
import { FeedContainer, FeedKind, PostType } from "./FeedContainer";
import { FieldValue, onSnapshot, query } from "firebase/firestore";
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
  const [posts, setPosts] = useState<PostType[]>();
  const shareContext = { shareUrl, updateShareUrl };
  const [cursor, setCursor] = useState<FieldValue>();
  const [reachedEnd, setReachedEnd] = useState(false);
  const [showShareDrawer, setShowShareDrawer] = useState(false);

  useEffect(() => {
    // TODO Not gr8
    if (shareUrl !== "") {
      setShowShareDrawer(true);
    }
  }, [shareUrl]);

  // TODO Simplify and extract to own functions
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
      <ShareContext.Provider value={shareContext}>
        <div className="App">
          <ScrollContainer onLoadMore={(bool) => setLoadMore(bool)}>
            {/* When adding routes, don't forget to also add them to usernames collection in the firestore */}
            <Routes>
              <Route
                path="/"
                element={
                  posts ? (
                    <FeedContainer
                      kind={FeedKind.Public}
                      posts={posts}
                      uid={userData.user?.uid}
                      username={userData.username}
                      reachedEnd={reachedEnd}
                    />
                  ) : (
                    <Spinner />
                  )
                }
              />
              <Route
                path="/posts/:filterKind/:filter"
                element={
                  posts ? (
                    <FeedContainer
                      kind={FeedKind.Filtered}
                      posts={posts}
                      username={userData.username}
                      reachedEnd={reachedEnd}
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
