import { User } from "firebase/auth";
import { createContext } from "react";

export const UserContext = createContext<{
  // TODO Not sure if null here is the best option
  user: User | null;
  username: string | null;
}>({
  user: null,
  username: null,
});
