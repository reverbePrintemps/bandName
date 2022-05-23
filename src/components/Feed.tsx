import { submitPost, SubmitPostCard } from "./SubmitPostCard";
import { FloatingButton } from "./FloatingButton";
import { FieldValue } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { firestore } from "../lib/firebase";
import { UserProfile } from "./UserProfile";
import { Card, CardKind } from "./Card";
import toast from "react-hot-toast";
import { Navbar } from "./Navbar";
import { useState } from "react";

import "../styles/Feed.css";

export type Post = {
  createdAt: FieldValue | number;
  heartCount: number;
  slug: string;
  title: string;
  genre: string;
  country: string;
  uid: string;
  // Same as for createdAt
  updatedAt: FieldValue;
  username: string;
};

export enum FeedKind {
  Public,
  Filtered,
}

type CommonProps = {
  posts: Post[];
  username: string | null | undefined;
  reachedEnd: boolean;
};

type FeedProps =
  | ({
      kind: FeedKind.Public;
      uid: string | undefined;
    } & CommonProps)
  | ({
      kind: FeedKind.Filtered;
    } & CommonProps);

export const Feed = (feedProps: FeedProps) => {
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
            {posts
              ? posts.map((post: Post) => {
                  const isOwner = post.username === username;

                  return (
                    <Card
                      // TODO using slug for now but might be cleverer to use id
                      key={post.slug}
                      kind={CardKind.Post}
                      title={post.title}
                      genre={post.genre}
                      country={post.country}
                      username={post.username}
                      clapCount={post.heartCount}
                      slug={post.slug}
                      isOwner={isOwner}
                      uid={post.uid}
                      postRef={firestore.doc(
                        `users/${post.uid}/posts/${post.slug}`
                      )}
                      createdAt={post.createdAt}
                      onSubmit={(submitPostProps) => {
                        toast.promise(submitPost(submitPostProps), {
                          loading: "Submitting...",
                          success: "Band name submitted successfully!",
                          error: "Woops. Something went wrong. Try again.",
                        });
                        setCreatePost(false);
                      }}
                    />
                  );
                })
              : null}
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
          {username && <UserProfile username={username} />}
          <div className="Feed">
            {filteredPosts
              ? filteredPosts.map((post: Post) => {
                  const isOwner = post.username === username;

                  return (
                    <Card
                      // TODO using slug for now but might be cleverer to use id
                      key={post.slug}
                      kind={CardKind.Post}
                      uid={post.uid}
                      title={post.title}
                      genre={post.genre}
                      country={post.country}
                      username={post.username}
                      clapCount={post.heartCount}
                      slug={post.slug}
                      isOwner={isOwner}
                      postRef={firestore.doc(
                        `users/${post.uid}/posts/${post.slug}`
                      )}
                      onSubmit={(submitPostProps) => {
                        toast.promise(submitPost(submitPostProps), {
                          loading: "Submitting...",
                          success: "Band name submitted successfully!",
                          error: "Woops. Something went wrong. Try again.",
                        });
                        setCreatePost(false);
                      }}
                      createdAt={post.createdAt}
                    />
                  );
                })
              : null}
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
