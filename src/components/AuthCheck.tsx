import { useContext } from "react";
import { UserContext } from "../lib/context";

import "../styles/AuthCheck.css";

// Component's children only shown to logged-in users
export const AuthCheck = (props: { children: any; fallback?: any }) => {
  const { username } = useContext(UserContext);

  return username
    ? props.children
    : props.fallback || (
        <div className="AuthCheck__message">
          Please sign in to share your band name
        </div>
      );
};
