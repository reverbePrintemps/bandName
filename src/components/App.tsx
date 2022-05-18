import { Route, Routes } from "react-router";
import { Feed } from "./Feed";
import { Navbar } from "./Navbar";
import { UserContext } from "../lib/context";
import { useUserData } from "../lib/hooks";
import { UserFeed } from "./UserFeed";
import { useEffect, useState } from "react";
import { getPosts } from "../lib/get-posts";
import { DocumentData } from "firebase/firestore";

import "../styles/App.css";

const App = () => {
  const userData = useUserData();
  const [posts, setPosts] = useState<DocumentData>();

  // Set initial posts
  useEffect(() => {
    (async () => {
      const initialPosts = await getPosts();
      setPosts(initialPosts);
    })();
  }, []);

  return (
    <UserContext.Provider value={userData}>
      <div className="App">
        <div className="App__innerContainer">
          <Navbar />
          <Routes>
            <Route path="/" element={posts && <Feed initialPosts={posts} />} />
            <Route
              path="/:urlUsername"
              element={posts && <UserFeed initialPosts={posts} />}
            />
          </Routes>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default App;
