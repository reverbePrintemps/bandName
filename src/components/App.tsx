import { DocumentData, onSnapshot, query } from "firebase/firestore";
import { POSTS_PER_REQUEST_LIMIT } from "../constants/constants";
import { ShareContext, UserContext } from "../lib/context";
import { FeedContainer, PostType } from "./FeedContainer";
import { firestore, postToJSON } from "../lib/firebase";
import { ScrollContainer } from "./ScrollContainer";
import { Route, Routes } from "react-router-dom";
import { UsernameForm } from "./UsernameForm";
import { useEffect, useState } from "react";
import { ShareDrawer } from "./ShareDrawer";
import { useUserData } from "../lib/hooks";
import { createPost } from "../lib/submit";
import { Post } from "./SinglePostPage";
import toast from "react-hot-toast";
import { Spinner } from "./Spinner";
import { Navbar } from "./Navbar";
import { Splash } from "./Splash";

import "../styles/App.css";

const App = () => {
  const userData = useUserData();
  const [loadMore, setLoadMore] = useState(false);
  const [shareUrl, updateShareUrl] = useState("");
  const [posts, setPosts] = useState<PostType[]>();
  const shareContext = { shareUrl, updateShareUrl };
  const [cursor, setCursor] = useState<DocumentData>();
  const [reachedEndOfPosts, setReachedEndOfPosts] = useState(false);
  const [showShareDrawer, setShowShareDrawer] = useState(false);
  const [orderBy, setOrderBy] = useState<"createdAt" | "heartCount">(
    "createdAt"
  );

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
      onSnapshot(
        query(
          firestore
            .collectionGroup("posts")
            .orderBy(orderBy, "desc")
            .limit(POSTS_PER_REQUEST_LIMIT)
        ),
        (querySnapshot) => {
          const posts = querySnapshot.docs.map(postToJSON);
          setReachedEndOfPosts(posts.length < POSTS_PER_REQUEST_LIMIT);
          setCursor(querySnapshot.docs[querySnapshot.docs.length - 1]);
          setPosts(posts);
        }
      );
    }
  }, [cursor, orderBy]);

  // TODO Extract to own functions
  useEffect(() => {
    // Listen for any changes to the posts collection
    if (cursor && loadMore) {
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
          setReachedEndOfPosts(newPosts.length < POSTS_PER_REQUEST_LIMIT);
          setCursor(querySnapshot.docs[querySnapshot.docs.length - 1]);
          setPosts(posts ? posts.concat(newPosts) : newPosts);
        }
      );
    }
  }, [loadMore, orderBy]);

  // Reset cursor on orderBy change
  useEffect(() => {
    setCursor(undefined);
  }, [orderBy]);

  return (
    <UserContext.Provider value={userData}>
      <ShareContext.Provider value={shareContext}>
        <Splash />
        <div className="App">
          <Navbar
            noSignIn={false}
            noProfile={false}
            onClick={() => {
              // Reset feed
              setOrderBy("createdAt");
              setReachedEndOfPosts(false);
              setCursor(undefined);
            }}
          />
          <ScrollContainer
            posts={posts}
            reachedEndOfPosts={reachedEndOfPosts}
            onLoadMore={(bool) => {
              setLoadMore(bool);
            }}
          >
            {/* When adding routes, don't forget to also add them to usernames collection in the firestore */}
            <Routes>
              <Route
                path="/"
                element={
                  posts ? (
                    <FeedContainer
                      posts={posts}
                      uid={userData.user?.uid}
                      username={userData.username}
                      reachedEnd={reachedEndOfPosts}
                      onSortPressed={(orderBy) => setOrderBy(orderBy)}
                      orderBy={orderBy}
                      onSubmit={(submitPostProps) => {
                        toast.promise(createPost(submitPostProps), {
                          loading: "Submitting...",
                          success: "Band name submitted successfully!",
                          error: "Woops. Something went wrong. Try again.",
                        });
                      }}
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
                      uid={userData.user?.uid}
                      posts={posts}
                      username={userData.username}
                      reachedEnd={reachedEndOfPosts}
                      onSortPressed={(orderBy) => setOrderBy(orderBy)}
                      orderBy={orderBy}
                      onSubmit={(submitPostProps) => {
                        toast.promise(createPost(submitPostProps), {
                          loading: "Submitting...",
                          success: "Band name submitted successfully!",
                          error: "Woops. Something went wrong. Try again.",
                        });
                      }}
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
              <Route path="/:usernameParam/posts/:postId" element={<Post />} />
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
