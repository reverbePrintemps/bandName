import { Route, Routes } from "react-router-dom";
import { Feed, FeedKind } from "./Feed";
import { UserContext } from "../lib/context";
import { useUserData } from "../lib/hooks";
import { UsernameForm } from "./UsernameForm";

import "../styles/App.css";

const App = () => {
  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <div className="App">
        <div className="App__innerContainer">
          {/* When adding routes, don't forget to also add them to usernames collection in the firestore */}
          <Routes>
            <Route path="/" element={<Feed kind={FeedKind.Public} />} />
            <Route
              path="/:urlUsername"
              element={<Feed kind={FeedKind.User} />}
            />
            <Route path="/signup" element={<UsernameForm />} />
          </Routes>
        </div>
      </div>
    </UserContext.Provider>
  );
};

export default App;
