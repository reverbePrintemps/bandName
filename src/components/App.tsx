import { Route, Routes } from "react-router";
import { Feed } from "./Feed";
import Navbar from "./Navbar";
import { UserContext } from "../lib/context";
import { useUserData } from "../lib/hooks";
import "../styles/App.css";
import { UserFeed } from "./UserFeed";

const App = () => {
  const { user, username } = useUserData();

  if (!user) {
    return null;
  }

  return (
    <UserContext.Provider value={{ user, username }}>
      <Navbar />
      <div className="App__container">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/:urlUsername" element={<UserFeed />} />
        </Routes>
      </div>
    </UserContext.Provider>
  );
};

export default App;
