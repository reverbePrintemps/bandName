import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../lib/context";

// Component's children only shown to logged-in users
export default function AuthCheck(props: { children: any; fallback?: any }) {
  const { username } = useContext(UserContext);

  return username
    ? props.children
    : props.fallback || <Link to="/enter">You must be signed in</Link>;
}
