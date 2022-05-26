import { FeedKind, PostType } from "./FeedContainer";
import { SubmitPostProps } from "./SubmitPostCard";
import { firestore } from "../lib/firebase";
import { useUserData } from "../lib/hooks";
import { Card, CardKind } from "./Card";

type CommonProps = {
  posts: PostType[];
  orderBy: "createdAt" | "heartCount";
};

type FeedProps =
  | ({
      kind: FeedKind.Public;
      onSubmit: (submitProps: SubmitPostProps) => void;
    } & CommonProps)
  | ({
      kind: FeedKind.Filtered;
    } & CommonProps);

export const Feed = (feedProps: FeedProps) => {
  const { username } = useUserData();
  const { posts, orderBy } = feedProps;

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

  switch (feedProps.kind) {
    case FeedKind.Public: {
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
                  postRef={firestore.doc(
                    `users/${post.uid}/posts/${post.slug}`
                  )}
                />
              );
            })}
        </>
      );
    }
    case FeedKind.Filtered: {
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
                  postRef={firestore.doc(
                    `users/${post.uid}/posts/${post.slug}`
                  )}
                />
              );
            })}
        </>
      );
    }
  }
};
