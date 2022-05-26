import React from "react";
import { Navbar } from "./Navbar";
import { Post } from "./Post";

type Props = {};

export const SinglePostPage = (props: Props) => {
  return (
    <>
      <Navbar noProfile={false} noSignIn={false} />
      <Post />
    </>
  );
};
