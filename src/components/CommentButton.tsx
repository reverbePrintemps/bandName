import { CardButton, CardButtonKind } from "./CardButton";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import toast from "react-hot-toast";

type CommentButtonProps = {
  username: string;
  postRef: firebase.firestore.DocumentReference;
};

export const CommentButton = ({ postRef, username }: CommentButtonProps) => {
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    onSnapshot(
      postRef.collection("comments"),
      (querySnapshot) => {
        const comments = querySnapshot.docs;
        setCommentCount(comments.length);
      },
      (error) => {
        console.log("Error getting comments count: ", error);
        toast.error(error.message);
      }
    );
  }, [postRef]);

  return (
    <CardButton
      kind={CardButtonKind.Comment}
      username={username}
      postRef={postRef}
    >
      {commentCount ?? 0} 💬
    </CardButton>
  );
};
