import { onSnapshot, DocumentData } from "firebase/firestore";
import { CardOverflowMenu } from "./CardOverflowMenu";
import { serverTimestamp } from "../lib/firebase";
import { useEffect, useState } from "react";
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
  const [comment, setComment] = useState("");
  const [commentCount, setCommentCount] = useState(0);
  const [canComment, setCanComment] = useState(false);
  const userData = useUserData();

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

  const handleSubmit = () => {
    (async () => {
      await postRef.collection("comments").add({
        comment,
        createdAt: serverTimestamp(),
        username: userData.username,
      });
      postRef.update({ commentCount: commentCount + 1 });
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
              <UserProfile username={comment.username} direction="row" />
              <span className="CommentsSection__timeAgo">
                {timeAgo(comment.createdAt.toMillis())}
              </span>
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
        <input
          type="text"
          className="CommentsSection__input"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
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
          className={`CommentsSection__button ${
            canComment ? "" : "m-disabled"
          }`}
          onClick={handleSubmit}
          disabled={!canComment}
        >
          Post
        </button>
      </div>
    </div>
  );
};
