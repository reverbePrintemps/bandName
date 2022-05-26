import { UserData } from "./hooks";
import { createContext } from "react";

export const UserContext = createContext<UserData>({
  user: null,
  username: null,
});

type ShareContextType = {
  shareUrl: string;
  updateShareUrl: (shareUrl: string) => void;
};

export const ShareContext = createContext<ShareContextType>({
  shareUrl: "",
  updateShareUrl: () => {},
});
