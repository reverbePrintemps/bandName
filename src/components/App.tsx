import { Route, Routes } from "react-router";
import { Feed } from "./Feed";
import { Navbar } from "./Navbar";
import { UserContext } from "../lib/context";
import { useUserData } from "../lib/hooks";
import { UserFeed } from "./UserFeed";
import "../styles/App.css";

const App = () => {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <div className="App">
        <div className="App__innerContainer">
          <Navbar />
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/:urlUsername" element={<UserFeed />} />
          </Routes>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default App;
