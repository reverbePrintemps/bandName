import { POSTS_PER_REQUEST_LIMIT } from "../constants/constants";
import { ShareContext, UserContext } from "../lib/context";
import { FeedContainer, PostType } from "./FeedContainer";
import { firestore, postToJSON } from "../lib/firebase";
import { getFromLocalStorage } from "../lib/storage";
import { MainContainer } from "./MainContainer";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { ShareDrawer } from "./ShareDrawer";
import { useUserData } from "../lib/hooks";
import { updateTheme } from "../lib/theme";
import { Post } from "./SinglePostPage";
import { Custom404 } from "./Custom404";
import toast from "react-hot-toast";
import { Navbar } from "./Navbar";
import { Splash } from "./Splash";
import { Login } from "./Login";
import {
  DocumentData,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import "../styles/App.css";

const App = () => {
  const userData = useUserData();
  const [loadMore, setLoadMore] = useState(false);
  const [shareUrl, updateShareUrl] = useState("");
  const shareContext = { shareUrl, updateShareUrl };
  const [posts, setPosts] = useState<PostType[]>();
  const [cursor, setCursor] = useState<DocumentData>();
  const [last, setLast] = useState<QueryDocumentSnapshot<DocumentData>>();
  const [reachedEndOfPosts, setReachedEndOfPosts] = useState(false);
  const [showShareDrawer, setShowShareDrawer] = useState(false);
  const [orderBy, setOrderBy] = useState<"createdAt" | "heartCount">(
    "createdAt"
  );
  const [theme, setTheme] = useState(getFromLocalStorage("theme"));
  const [showSplash, setShowSplash] = useState(true);
  const [body, setBody] = useState<HTMLBodyElement | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(false);

  useEffect(() => {
    setBody(window.document.querySelector("body"));
  }, []);

  useEffect(() => {
    if (body) {
      updateTheme(body, theme);
    }
  }, [theme, body]);

  useEffect(() => {
    // TODO Not gr8
    if (shareUrl !== "") {
      setShowShareDrawer(true);
    }
  }, [shareUrl]);

  // TODO Extract to own functions
  useEffect(() => {
    if (!cursor) {
      setLoadingPosts(true);
      // Listen for any changes to the posts collection
      onSnapshot(
        query(
          firestore
            .collectionGroup("posts")
            .orderBy(orderBy, "desc")
            .limit(POSTS_PER_REQUEST_LIMIT)
        ),
        (querySnapshot) => {
          const posts = querySnapshot.docs.map(postToJSON) as PostType[];
          setReachedEndOfPosts(posts.length < POSTS_PER_REQUEST_LIMIT);
          setLast(querySnapshot.docs[querySnapshot.docs.length - 1]);
          setPosts(posts);
        },
        (error) => {
          console.log("Error getting posts: ", error);
          toast.error(error.message);
        }
      );
    }
  }, [cursor, orderBy]);

  useEffect(() => {
    // Listen for any changes to the posts collection
    if (cursor && loadMore) {
      setLoadingPosts(true);
      onSnapshot(
        query(
          firestore
            .collectionGroup("posts")
            .orderBy(orderBy, "desc")
            .startAfter(cursor)
            .limit(POSTS_PER_REQUEST_LIMIT)
        ),
        (querySnapshot) => {
          const newPosts = querySnapshot.docs.map(postToJSON) as PostType[];
          setReachedEndOfPosts(newPosts.length < POSTS_PER_REQUEST_LIMIT);
          setLast(querySnapshot.docs[querySnapshot.docs.length - 1]);
          setPosts((posts) => (posts ? posts.concat(newPosts) : newPosts));
        },
        (error) => {
          console.log("Error getting posts: ", error);
          toast.error(error.message);
        }
      );
    }
  }, [loadMore, orderBy, cursor]);

  // Reset cursor on orderBy change
  useEffect(() => {
    setCursor(undefined);
  }, [orderBy]);

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 1500);
  });

  useEffect(() => {
    if (posts) {
      setLoadingPosts(false);
    }
  }, [posts]);

  useEffect(() => {
    setCursor(last);
  }, [last]);

  return (
    <UserContext.Provider value={userData}>
      <ShareContext.Provider value={shareContext}>
        <Splash show={showSplash} />
        <div className="App">
          <Navbar
            theme={theme}
            onClick={() => {
              // Reset feed
              setOrderBy("createdAt");
              setReachedEndOfPosts(false);
              setCursor(undefined);
            }}
            onThemeChange={(theme) => {
              setTheme(theme);
            }}
          />
          <MainContainer
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
                  posts && (
                    <FeedContainer
                      posts={posts}
                      uid={userData.user?.uid}
                      username={userData.username}
                      reachedEnd={reachedEndOfPosts}
                      onSortPressed={(orderBy) => setOrderBy(orderBy)}
                      orderBy={orderBy}
                      loadingPosts={loadingPosts}
                    />
                  )
                }
              />
              <Route
                path="/posts/:filterKind/:filter"
                element={
                  posts && (
                    <FeedContainer
                      uid={userData.user?.uid}
                      posts={posts}
                      username={userData.username}
                      reachedEnd={reachedEndOfPosts}
                      onSortPressed={(orderBy) => setOrderBy(orderBy)}
                      orderBy={orderBy}
                      loadingPosts={loadingPosts}
                    />
                  )
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/:usernameParam/posts/:postId" element={<Post />} />
              <Route path="*" element={<Custom404 />} />
            </Routes>
          </MainContainer>
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
