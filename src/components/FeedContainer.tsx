import { CreatePostProps, editPost } from "../lib/submit";
import { FloatingButton } from "./FloatingButton";
import { SubmitPostCard } from "./SubmitPostCard";
import { FieldValue } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { UserProfile } from "./UserProfile";
import { SortMenu } from "./SortMenu";
import toast from "react-hot-toast";
import { useState } from "react";
import { Feed } from "./Feed";

import "../styles/FeedContainer.css";

export type PostType = {
  uid: string;
  slug: string;
  genre: string;
  title: string;
  country: string;
  username: string;
  createdAt: number;
  heartCount: number;
  description: string;
  onSubmit: () => void;
  updatedAt: FieldValue;
  onCancelSubmission: () => void;
};

export enum FeedKind {
  Public,
  Filtered,
}

type FeedContainerProps = {
  posts: PostType[];
  username: string | null | undefined;
  reachedEnd: boolean;
  onSortPressed: (sort: "createdAt" | "heartCount") => void;
  onSubmit: (submitProps: CreatePostProps) => void;
  orderBy: "createdAt" | "heartCount";
  uid: string | undefined;
};

export const FeedContainer = (feedProps: FeedContainerProps) => {
  const { filterKind, filter } = useParams<{
    filterKind: "username" | "country" | "genre";
    filter: string;
  }>();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const { username, reachedEnd, onSortPressed, orderBy, uid, onSubmit } =
    feedProps;
  const filteredPosts =
    filterKind &&
    filter &&
    feedProps.posts.filter((post) => post[filterKind] === filter);
  const posts = filter ? filteredPosts : feedProps.posts;

  return (
    <>
      {username === filter && username && <UserProfile username={username} />}
      <div className="FeedContainer__feedHeader">
        <p className="FeedContainer__feedTitle">
          {orderBy === "createdAt" ? "Latest" : "Most popular"}
        </p>
        <SortMenu onSortPressed={onSortPressed} />
      </div>
      <div className="Feed">
        <FloatingButton
          show={!showCreatePost}
          onClick={() => {
            if (username) {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
              setShowCreatePost(true);
            } else {
              toast.error("You must be signed in to create a post.", {
                position: "bottom-center",
                style: { marginBottom: "72px" },
              });
            }
          }}
        />
        {showCreatePost && uid && username && (
          <SubmitPostCard
            uid={uid}
            username={username}
            onCancelSubmission={() => setShowCreatePost(!showCreatePost)}
            onSubmit={(submitPostProps) => {
              onSubmit(submitPostProps);
              setShowCreatePost(false);
            }}
          />
        )}
        {posts && (
          <Feed
            posts={posts}
            orderBy={orderBy}
            onSubmit={(submitPostProps) => {
              toast.promise(editPost(submitPostProps), {
                loading: "Editing...",
                success: "Band name edited successfully!",
                error: "Woops. Something went wrong. Try again.",
              });
              setShowCreatePost(false);
            }}
            onCancelSubmission={() => setShowCreatePost(!showCreatePost)}
          />
        )}
        {reachedEnd && (
          <span className="FeedContainer__footerMessage">
            This is the end, my friend.
          </span>
        )}
      </div>
    </>
  );
};
