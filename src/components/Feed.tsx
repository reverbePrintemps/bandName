import { firestore } from "../lib/firebase";
import { FeedKind, PostType } from "./FeedContainer";
import { useUserData } from "../lib/hooks";
import { Card, CardKind } from "./Card";
import { SubmitPostProps } from "./SubmitPostCard";

type CommonProps = {
  posts: PostType[];
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
  const { posts } = feedProps;
  switch (feedProps.kind) {
    case FeedKind.Public: {
      return (
        <>
          {posts.map((post: PostType) => {
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
                postRef={firestore.doc(`users/${post.uid}/posts/${post.slug}`)}
              />
            );
          })}
        </>
      );
    }
    case FeedKind.Filtered: {
      return (
        <>
          {posts.map((post: PostType) => {
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
                postRef={firestore.doc(`users/${post.uid}/posts/${post.slug}`)}
              />
            );
          })}
        </>
      );
    }
  }
};
