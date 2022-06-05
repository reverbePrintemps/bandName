import { createPost, editPost } from "../lib/submit";
import { SubmitPostCard } from "./SubmitPostCard";
import { FloatingButton } from "./FloatingButton";
import { firestore } from "../lib/firebase";
import { useEffect, useState } from "react";
import { PostType } from "./FeedContainer";
import { useUserData } from "../lib/hooks";
import { Card, CardKind } from "./Card";
import { User } from "firebase/auth";
import toast from "react-hot-toast";

import "../styles/Feed.css";
import { Spinner } from "./Spinner";

type FeedProps = {
  posts: PostType[];
  orderBy: "createdAt" | "heartCount";
  loadingPosts: boolean;
};

export const Feed = ({ posts, orderBy, loadingPosts }: FeedProps) => {
  const { user, username } = useUserData();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [userId, setUserId] = useState<User["uid"]>();

  useEffect(() => {
    if (user) {
      setUserId(user.uid);
    }
  }, [user]);

  const sortPosts = (a: PostType, b: PostType) => {
    switch (orderBy) {
      case "createdAt":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "heartCount":
        return b.heartCount - a.heartCount;
      default:
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  };

  return (
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
      {showCreatePost && userId && username && (
        <SubmitPostCard
          uid={userId}
          username={username}
          onCancelSubmission={() => setShowCreatePost(!showCreatePost)}
          onSubmit={(submitPostProps) => {
            toast.promise(createPost(submitPostProps), {
              loading: "Submitting...",
              success: "Band name created successfully!",
              error: "Woops. Something went wrong. Try again.",
            });
            setShowCreatePost(false);
          }}
        />
      )}
      {posts
        .sort((a, b) => sortPosts(a, b))
        .map((post: PostType) => {
          const isOwner = post.username === username;
          return (
            <Card
              kind={CardKind.Post}
              uid={post.uid}
              key={post.slug}
              slug={post.slug}
              isOwner={isOwner}
              title={post.title}
              genre={post.genre}
              country={post.country}
              username={post.username}
              createdAt={post.createdAt}
              clapCount={post.heartCount}
              description={post.description}
              postRef={firestore.doc(`users/${post.uid}/posts/${post.slug}`)}
              onSubmit={(submitPostProps) =>
                toast.promise(editPost(submitPostProps), {
                  loading: "Submitting...",
                  success: "Band name edited successfully!",
                  error: "Woops. Something went wrong. Try again.",
                })
              }
              onCancelSubmission={() => {
                setShowCreatePost(false);
              }}
            />
          );
        })}
      {loadingPosts && <Spinner />}
    </div>
  );
};
