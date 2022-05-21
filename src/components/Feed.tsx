import {
  firestore,
  fromMillis,
  getUserWithUsername,
  postToJSON,
} from "../lib/firebase";
import {
  getFilteredPosts,
  getPosts,
  POSTS_PER_REQUEST_LIMIT,
} from "../lib/get-posts";
import {
  DocumentData,
  FieldValue,
  onSnapshot,
  query,
} from "firebase/firestore";
import { CreateNewPost } from "./CreateNewPost";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { UserProfile } from "./UserProfile";
import { useNavigate } from "react-router";
import { useUserData } from "../lib/hooks";
import { Card, CardKind } from "./Card";
import { Spinner } from "./Spinner";
import toast from "react-hot-toast";
import { Navbar } from "./Navbar";

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

type FeedProps =
  | {
      kind: FeedKind.Public;
    }
  | {
      kind: FeedKind.Filtered;
    };

// TODO simplify
export const Feed = (feedProps: FeedProps) => {
  const { path } = useParams();
  // TODO use context instead of hook
  const currentlyLoggedInUser = useUserData();
  const user = currentlyLoggedInUser.user;
  const username = currentlyLoggedInUser.username;
  const [createPost, setCreatePost] = useState(false);
  const [posts, setPosts] = useState<DocumentData>();
  const [last, setLast] = useState<Post>();
  const [reachedEnd, setReachedEnd] = useState<boolean>();
  const [userDoc, setUserDoc] = useState<DocumentData>();
  const [loading, setLoading] = useState<boolean>();
  const [cursor, setCursor] = useState<FieldValue>();

  const navigate = useNavigate();

  useEffect(() => {
    onSnapshot(
      query(
        firestore
          .collectionGroup("posts")
          .orderBy("createdAt", "desc")
          .limit(POSTS_PER_REQUEST_LIMIT)
      ),
      (querySnapshot) => {
        const posts = querySnapshot.docs.map(postToJSON);
        setPosts(posts);
      }
    );
  }, []);

  const getMorePosts = async (last: Post) => {
    setLoading(true);
    setCursor(
      typeof last.createdAt === "number"
        ? fromMillis(last.createdAt)
        : last.createdAt
    );

    await getPosts(cursor, userDoc).then((newPosts) => {
      setReachedEnd(newPosts.length < POSTS_PER_REQUEST_LIMIT);
      posts && setPosts(posts.concat(newPosts));
      setLoading(false);
    });
  };

  //  Set cursor
  useEffect(() => {
    if (last) {
      setCursor(
        typeof last.createdAt === "number"
          ? fromMillis(last.createdAt)
          : last.createdAt
      );
    }
  }, [last]);

  // Set last
  useEffect(() => {
    if (posts) {
      setLast(posts[posts.length - 1]);
    }
  }, [posts]);

  // Set userDoc
  useEffect(() => {
    if (path === username) {
      (async () => {
        await getUserWithUsername(path).then((userDoc) => setUserDoc(userDoc));
      })();
    } else if (path !== undefined) {
      (async () => {
        await getFilteredPosts(path).then((newPosts) => {
          setLoading(true);
          setPosts(newPosts);
          setLoading(false);
        });
      })();
    } else {
      // TODO Duplicate code below, should be extracted
      (async () => {
        await getPosts(undefined, userDoc).then((newPosts) => {
          setLoading(true);
          setReachedEnd(newPosts.length < POSTS_PER_REQUEST_LIMIT);
          setPosts(newPosts);
          setLoading(false);
        });
      })();
    }
  }, [path, username]);

  // Trigger rerender when username changes
  useEffect(() => {
    // When logged out, username === null
    const hasNoUsername = username === undefined;
    if (hasNoUsername) {
      navigate("/signup");
    }
    (async () => {
      await getPosts(undefined, userDoc).then((newPosts) => {
        setLoading(true);
        setReachedEnd(newPosts.length < POSTS_PER_REQUEST_LIMIT);
        setPosts(newPosts);
        setLoading(false);
      });
    })();
  }, [userDoc, username]);

  switch (feedProps.kind) {
    case FeedKind.Public:
      return (
        <>
          <Navbar noSignIn={false} noProfile={false} />
          {loading ? (
            <Spinner />
          ) : (
            <div className="Feed">
              <button
                tabIndex={0}
                className="Feed__floatingButton"
                aria-label="Submit a new post"
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
              >
                +
              </button>
              {createPost && user && username && (
                <CreateNewPost
                  user={user}
                  username={username}
                  cancelSubmission={() => setCreatePost(!createPost)}
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
                        user={user}
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
          )}
        </>
      );
    case FeedKind.Filtered:
      return (
        <>
          <Navbar noSignIn={false} noProfile />
          {loading ? (
            <Spinner />
          ) : (
            <>
              {username && <UserProfile user={currentlyLoggedInUser} />}
              <div className="Feed">
                {posts
                  ? posts.map((post: Post) => {
                      const isOwner = post.username === username;

                      return (
                        <Card
                          // TODO using slug for now but might be cleverer to use id
                          key={post.slug}
                          kind={CardKind.Post}
                          user={user}
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
          )}
        </>
      );
  }
};
