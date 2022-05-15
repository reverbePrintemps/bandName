import { Box } from "@mui/material";
import { DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import Feed from "./components/Feed";
import Navbar from "./components/Navbar";
import { firestore, postToJSON } from "./lib/firebase";

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
  const [posts, setPosts] = useState<DocumentData>();
  useEffect(() => {
    (async () => {
      const initialPosts = await getInitialPosts();
      setPosts(initialPosts);
    })();
  }, []);
  return (
    <Box>
      <Navbar />
      <Routes>
        <Route path="/" element={posts && <Feed posts={posts} />} />
      </Routes>
    </Box>
  );
};

export default App;
