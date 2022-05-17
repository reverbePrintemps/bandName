import { Route, Routes } from "react-router";
import { Feed } from "./Feed";
import Navbar from "./Navbar";
import { UserContext } from "../lib/context";
import { useUserData } from "../lib/hooks";
import "../styles/App.css";
import { UserFeed } from "./UserFeed";

const App = () => {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
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
