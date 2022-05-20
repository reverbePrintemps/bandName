import { firestore, fromMillis, getUserWithUsername } from "../lib/firebase";
import { getPosts, POSTS_PER_REQUEST_LIMIT } from "../lib/get-posts";
import { DocumentData, FieldValue } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { CreateNewPost } from "./CreateNewPost";
import { useEffect, useState } from "react";
import { UserProfile } from "./UserProfile";
import { useUserData } from "../lib/hooks";
import { Add } from "@mui/icons-material";
import { Card, CardKind } from "./Card";
import { Spinner } from "./Spinner";
import { Navbar } from "./Navbar";
import { Fab as FloatingButton } from "@mui/material";

import "../styles/Feed.css";

export type Post = {
  createdAt: FieldValue;
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
  User,
}

type FeedProps =
  | {
      kind: FeedKind.Public;
    }
  | {
      kind: FeedKind.User;
    };

export const Feed = (feedProps: FeedProps) => {
  const { urlUsername } = useParams();
  // TODO use context instead of hook
  const currentlyLoggedInUser = useUserData();
  const user = currentlyLoggedInUser.user;
  const username = currentlyLoggedInUser.username;
  const [createPost, setCreatePost] = useState(false);
  const [posts, setPosts] = useState<DocumentData>();
  const [last, setLast] = useState<Post>();
  const [reachedEnd, setReachedEnd] = useState<boolean>();
  const [userDoc, setUserDoc] = useState<DocumentData>();
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<FieldValue>();

  const navigate = useNavigate();

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
    if (urlUsername) {
      (async () => {
        await getUserWithUsername(urlUsername).then((userDoc) =>
          setUserDoc(userDoc)
        );
      })();
    } else {
      setUserDoc(undefined);
    }
  }, [urlUsername]);

  // Trigger rerender when username changes
  useEffect(() => {
    if (username) {
      (async () => {
        setLoading(true);
        await getPosts(undefined, userDoc).then((newPosts) => {
          setReachedEnd(newPosts.length < POSTS_PER_REQUEST_LIMIT);
          setPosts(newPosts);
          setLoading(false);
        });
      })();
    } else if (username === undefined) {
      navigate("/signup");
    }
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
              <div className="Feed__floatingButton">
                <FloatingButton
                  href="#top"
                  color="primary"
                  aria-label="add"
                  onClick={() => setCreatePost(true)}
                >
                  <Add />
                </FloatingButton>
              </div>
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
    case FeedKind.User:
      return (
        <>
          <Navbar noSignIn={false} noProfile />
          {loading ? (
            <Spinner />
          ) : (
            <>
              <UserProfile user={currentlyLoggedInUser} />
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
