import { Box } from "@mui/material";
import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import Feed from "./components/Feed";
import Navbar from "./components/Navbar";
import { UserContext } from "./lib/context";
import { firestore, postToJSON } from "./lib/firebase";
import { useUserData } from "./lib/hooks";

// Max post to query per page
export const POSTS_PER_REQUEST_LIMIT = 3;

const getInitialPosts = async () => {
  const postsQuery = firestore
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

  useEffect(() => {
    (async () => {
      const initialPosts = await getInitialPosts();
      setPosts(initialPosts);
    })();
  }, []);

  if (!user) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user, username }}>
      <Box>
        <Navbar />
        <Routes>
          <Route path="/" element={posts && <Feed posts={posts} />} />
        </Routes>
      </Box>
    </UserContext.Provider>
  );
};

export default App;
