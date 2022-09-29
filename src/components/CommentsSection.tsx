import { onSnapshot, DocumentData } from "firebase/firestore";
import { FormEvent, useEffect, useState } from "react";
import { CardOverflowMenu } from "./CardOverflowMenu";
import { serverTimestamp } from "../lib/firebase";
import { UserProfile } from "./UserProfile";
import firebase from "firebase/compat/app";
import { useUserData } from "../lib/hooks";
import { timeAgo } from "../lib/timeAgo";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import "../styles/CommentsSection.css";

type CommentsSectionProps = {
  postRef: firebase.firestore.DocumentReference;
};

export const CommentsSection = ({ postRef }: CommentsSectionProps) => {
  const [comments, setComments] = useState<DocumentData[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [canComment, setCanComment] = useState(false);
  const [comment, setComment] = useState("");
  const [locale, setLocale] = useState<string>("en-US");
  const userData = useUserData();

  useEffect(() => {
    if (navigator.language !== "") {
      setLocale(navigator.language);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    onSnapshot(
      postRef.collection("comments").orderBy("createdAt", "asc"),
      (querySnapshot) => {
        const comments = querySnapshot.docs.map((doc) => doc.data());
        setComments(comments);
        setCommentCount(comments.length);
      },
      (error) => {
        console.log("Error getting comments: ", error);
        toast.error(error.message);
      }
    );
  }, [postRef]);

  useEffect(() => {
    if (userData.username && comment.length > 0) {
      setCanComment(true);
    } else {
      setCanComment(false);
    }
  }, [comment]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    (async () => {
      await postRef.collection("comments").add({
        comment,
        createdAt: serverTimestamp(),
        username: userData.username,
      });
      // Reset input
      setComment("");
    })();
  };

  return (
    <div className="CommentsSection">
      <p className="CommentsSection__header">{commentCount} Comments</p>
      {/* TODO Do not use index */}
      {comments.map((comment, index) => {
        return (
          <div key={index} className="CommentsSection__commentContainer">
            <div className="CommentsSection___commentHeader">
              <div className="CommentsSection__commentHeaderLeft">
                <UserProfile username={comment.username} direction="row" />
                <span className="CommentsSection__timeAgo">
                  {comment.createdAt &&
                    timeAgo(locale, comment.createdAt.toDate())}
                </span>
              </div>
              <CardOverflowMenu
                isOwner={userData.username === comment.username}
                onSharePressed={() => null}
                onEditPressed={() => null}
                onDeletePressed={() => null}
              />
            </div>
            <div className="CommentsSection__commentText">
              {comment.comment}
            </div>
          </div>
        );
      })}
      <div className="CommentsSection__inputContainer">
        <form
          className="CommentsSection__inputContainerInner"
          onSubmit={(e) => handleSubmit(e)}
        >
          <input
            type="text"
            className="CommentsSection__input"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Leave a comment..."
            autoFocus
            onClick={() => {
              if (!userData.username) {
                toast.error(() => (
                  <span>
                    You must be signed in to comment.
                    <br />
                    <Link
                      to="/login"
                      style={{ color: "blue", textDecoration: "underline" }}
                      onClick={(t) => toast.dismiss(t.currentTarget.id)}
                    >
                      Sign in
                    </Link>
                  </span>
                ));
              }
            }}
          />
          <button
            type="submit"
            className={`CommentsSection__button ${
              canComment ? "" : "m-disabled"
            }`}
            disabled={!canComment}
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
};
