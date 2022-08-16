import { DocumentData, onSnapshot, query } from "firebase/firestore";
import { POSTS_PER_REQUEST_LIMIT } from "../constants/constants";
import { ShareContext, UserContext } from "../lib/context";
import { getThemeFromLocalStorage } from "../lib/storage";
import { FeedContainer, PostType } from "./FeedContainer";
import { PasswordResetForm } from "./PasswordResetForm";
import { firestore, postToJSON } from "../lib/firebase";
import { Route, Routes } from "react-router-dom";
import { MainContainer } from "./MainContainer";
import { useEffect, useState } from "react";
import { ShareDrawer } from "./ShareDrawer";
import { useUserData } from "../lib/hooks";
import { updateTheme } from "../lib/theme";
import { SinglePostPage } from "./SinglePostPage";
import { Custom404 } from "./Custom404";
import toast from "react-hot-toast";
import { Navbar } from "./Navbar";
import { Splash } from "./Splash";
import { About } from "./About";
import { Login } from "./Login";

import "../styles/App.css";

const App = () => {
  const userData = useUserData();
  const [loadMore, setLoadMore] = useState(false);
  const [shareUrl, updateShareUrl] = useState("");
  const shareContext = { shareUrl, updateShareUrl };
  const [posts, setPosts] = useState<PostType[]>();
  const [cursor, setCursor] = useState<DocumentData>();
  const [reachedEndOfPosts, setReachedEndOfPosts] = useState(false);
  const [showShareDrawer, setShowShareDrawer] = useState(false);
  const [orderBy, setOrderBy] = useState<"createdAt" | "heartCount">(
    "createdAt"
  );
  const [theme, setTheme] = useState(getThemeFromLocalStorage());
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

  // TODO: Would love to use only one useEffect and one onSnapshot() listener but I have not yet been able to. **Believe me**, I've tried.
  useEffect(() => {
    // Listen for any changes to the posts collection
    onSnapshot(
      query(
        firestore
          .collectionGroup("posts")
          .orderBy(orderBy, "desc")
          .limit(POSTS_PER_REQUEST_LIMIT)
      ),
      (querySnapshot) => {
        const initialPosts = querySnapshot.docs.map(postToJSON) as PostType[];
        setReachedEndOfPosts(initialPosts.length < POSTS_PER_REQUEST_LIMIT);
        setCursor(querySnapshot.docs[querySnapshot.docs.length - 1]);
        setPosts(initialPosts);
      },
      (error) => {
        console.log("Error getting posts: ", error);
        toast.error(error.message);
      }
    );
  }, [orderBy]);

  useEffect(() => {
    // Listen for changes to the posts collection
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
          setCursor(querySnapshot.docs[querySnapshot.docs.length - 1]);
          setPosts(posts ? posts.concat(newPosts) : newPosts);
        },
        (error) => {
          console.log("Error getting posts: ", error);
          toast.error(error.message);
        }
      );
    }
  }, [loadMore, cursor, orderBy, posts]);

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

  return (
    <UserContext.Provider value={userData}>
      <ShareContext.Provider value={shareContext}>
        <Splash show={showSplash} />
        <div className="App">
          <Navbar
            theme={theme}
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
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
              <Route
                path="/:usernameParam/posts/:postId"
                element={<SinglePostPage />}
              />
              <Route path="/password_reset" element={<PasswordResetForm />} />
              <Route path="/about" element={<About />} />
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
