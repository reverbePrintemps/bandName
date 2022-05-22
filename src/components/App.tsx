import { getPosts, POSTS_PER_REQUEST_LIMIT } from "../lib/get-posts";
import { firestore, postToJSON } from "../lib/firebase";
import { onSnapshot, query } from "firebase/firestore";
import { Route, Routes } from "react-router-dom";
import { UsernameForm } from "./UsernameForm";
import { Feed, FeedKind, Post } from "./Feed";
import { UserContext } from "../lib/context";
import { useEffect, useState } from "react";
import { useUserData } from "../lib/hooks";

import "../styles/App.css";
import { Spinner } from "./Spinner";

const App = () => {
  const userData = useUserData();
  const username = userData.username;
  const [posts, setPosts] = useState<Post[]>();

  useEffect(() => {
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
  }, []);

  return (
    <UserContext.Provider value={userData}>
      <div className="App">
        <div className="App__innerContainer">
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
                  />
                ) : (
                  <Spinner />
                )
              }
            />
            <Route path="/signup" element={<UsernameForm />} />
          </Routes>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default App;
