import { submitPost, SubmitPostCard } from "./SubmitPostCard";
import { FloatingButton } from "./FloatingButton";
import { FieldValue } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { UserProfile } from "./UserProfile";
import toast from "react-hot-toast";
import { Navbar } from "./Navbar";
import { useState } from "react";
import { Feed } from "./Feed";

import "../styles/Feed.css";

export type PostType = {
  uid: string;
  username: string;
  title: string;
  slug: string;
  genre: string;
  country: string;
  heartCount: number;
  createdAt: FieldValue | number;
  updatedAt: FieldValue;
};

export enum FeedKind {
  Public,
  Filtered,
}

type CommonProps = {
  posts: PostType[];
  username: string | null | undefined;
  reachedEnd: boolean;
};

type FeedContainerProps =
  | ({
      kind: FeedKind.Public;
      uid: string | undefined;
    } & CommonProps)
  | ({
      kind: FeedKind.Filtered;
    } & CommonProps);

export const FeedContainer = (feedProps: FeedContainerProps) => {
  const { filterKind, filter } = useParams<{
    filterKind: "username" | "country" | "genre";
    filter: string;
  }>();

  const [createPost, setCreatePost] = useState(false);

  switch (feedProps.kind) {
    case FeedKind.Public: {
      const { posts, username, uid, reachedEnd } = feedProps;
      return (
        <>
          <Navbar noSignIn={false} noProfile={false} />
          <div className="Feed">
            <FloatingButton
              show={!createPost}
              onClick={() => {
                if (username) {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                  setCreatePost(true);
                } else {
                  toast.error("You must be signed in to create a post.", {
                    position: "bottom-center",
                    style: { marginBottom: "72px" },
                  });
                }
              }}
            />
            {createPost && uid && username && (
              <SubmitPostCard
                uid={uid}
                username={username}
                onCancelSubmission={() => setCreatePost(!createPost)}
                onSubmit={(submitPostProps) => {
                  toast.promise(submitPost(submitPostProps), {
                    loading: "Submitting...",
                    success: "Band name submitted successfully!",
                    error: "Woops. Something went wrong. Try again.",
                  });
                  setCreatePost(false);
                }}
              />
            )}
            <Feed
              kind={FeedKind.Public}
              posts={posts}
              onSubmit={(submitPostProps) => {
                toast.promise(submitPost(submitPostProps), {
                  loading: "Submitting...",
                  success: "Band name submitted successfully!",
                  error: "Woops. Something went wrong. Try again.",
                });
                setCreatePost(false);
              }}
            />
            {reachedEnd && (
              <span className="Feed__footerMessage">
                This is the end, my friend. (for now)
              </span>
            )}
          </div>
        </>
      );
    }
    case FeedKind.Filtered: {
      const { posts, username, reachedEnd } = feedProps;
      const filteredPosts =
        filterKind &&
        filter &&
        posts.filter((post) => post[filterKind] === filter);
      return (
        <>
          <Navbar noSignIn={false} noProfile />
          {username === filter && username && (
            <UserProfile username={username} />
          )}
          <div className="Feed">
            {filteredPosts && (
              <Feed kind={FeedKind.Filtered} posts={filteredPosts} />
            )}
            {reachedEnd && (
              <span className="Feed__footerMessage">
                This is the end, my friend. (for now)
              </span>
            )}
          </div>
        </>
      );
    }
  }
};
