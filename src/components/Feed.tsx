import { submitPost, SubmitPostCard } from "./SubmitPostCard";
import { DocumentData, FieldValue } from "firebase/firestore";
import { FloatingButton } from "./FloatingButton";
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
  const [last, setLast] = useState<Post>();
  const [reachedEnd, setReachedEnd] = useState<boolean>();
  const [userDoc, setUserDoc] = useState<DocumentData>();
  const [cursor, setCursor] = useState<FieldValue>();

  const getMorePosts = async (last: Post) => {
    // setLoading(true);
    // setCursor(
    //   typeof last.createdAt === "number"
    //     ? fromMillis(last.createdAt)
    //     : last.createdAt
    // );
    // await getPosts(cursor, userDoc).then((newPosts) => {
    //   setReachedEnd(newPosts.length < POSTS_PER_REQUEST_LIMIT);
    //   posts && setPosts(posts.concat(newPosts));
    //   setLoading(false);
    // });
  };

  //  Set cursor
  // useEffect(() => {
  //   if (last) {
  //     setCursor(
  //       typeof last.createdAt === "number"
  //         ? fromMillis(last.createdAt)
  //         : last.createdAt
  //     );
  //   }
  // }, [last]);

  // Set last
  // useEffect(() => {
  //   if (posts) {
  //     setLast(posts[posts.length - 1]);
  //   }
  // }, [posts]);

  // Set userDoc
  // useEffect(() => {
  //   if (path === username) {
  //     (async () => {
  //       await getUserWithUsername(path).then((userDoc) => setUserDoc(userDoc));
  //     })();
  //   } else if (path !== undefined) {
  //     (async () => {
  //       await getFilteredPosts(path).then((newPosts) => {
  //         setLoading(true);
  //         setPosts(newPosts);
  //         setLoading(false);
  //       });
  //     })();
  //   } else {
  //     // TODO Duplicate code below, should be extracted
  //     (async () => {
  //       await getPosts(undefined, userDoc).then((newPosts) => {
  //         setLoading(true);
  //         setReachedEnd(newPosts.length < POSTS_PER_REQUEST_LIMIT);
  //         setPosts(newPosts);
  //         setLoading(false);
  //       });
  //     })();
  //   }
  // }, [path, username]);

  // Trigger rerender when username changes
  // useEffect(() => {
  //   // When logged out, username === null
  //   const hasNoUsername = username === undefined;
  //   if (hasNoUsername) {
  //     navigate("/signup");
  //   }
  //   (async () => {
  //     await getPosts(undefined, userDoc).then((newPosts) => {
  //       setLoading(true);
  //       setReachedEnd(newPosts.length < POSTS_PER_REQUEST_LIMIT);
  //       setPosts(newPosts);
  //       setLoading(false);
  //     });
  //   })();
  // }, [userDoc, username]);

  switch (feedProps.kind) {
    case FeedKind.Public: {
      const { posts, username, uid } = feedProps;
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
            {!reachedEnd ? (
              <button
                className="Feed__loadMoreButton"
                onClick={() => last && getMorePosts(last)}
              >
                Load more
              </button>
            ) : (
              <span className="Feed__footerMessage">
                This is the end, my friend. (for now)
              </span>
            )}
          </div>
        </>
      );
    }
    case FeedKind.Filtered: {
      const { posts, username } = feedProps;
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
            {!reachedEnd ? (
              <button
                className="Feed__loadMoreButton"
                onClick={() => last && getMorePosts(last)}
              >
                Load more
              </button>
            ) : (
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
