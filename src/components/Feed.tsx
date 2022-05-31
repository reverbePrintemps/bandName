import { EditPostProps } from "../lib/submit";
import { firestore } from "../lib/firebase";
import { PostType } from "./FeedContainer";
import { useUserData } from "../lib/hooks";
import { Card, CardKind } from "./Card";

import "../styles/Feed.css";

type FeedProps = {
  posts: PostType[];
  orderBy: "createdAt" | "heartCount";
  onSubmit: (submitProps: EditPostProps) => void;
  onCancelSubmission: () => void;
};

export const Feed = ({
  posts,
  orderBy,
  onSubmit,
  onCancelSubmission,
}: FeedProps) => {
  const { username } = useUserData();

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
    <>
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
              onSubmit={onSubmit}
              onCancelSubmission={onCancelSubmission}
            />
          );
        })}
    </>
  );
};
