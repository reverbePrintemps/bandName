import { firestore, auth, increment } from "../lib/firebase";
import "../styles/HeartButton.css";

// TODO Not a fan of this any
type HeartProps = {
  ownPost: boolean;
  postRef: any;
  count: number;
};

// Allows user to heart or like a post
export const HeartButton = ({ ownPost, postRef, count }: HeartProps) => {
  const currentlySignedInUser = auth.currentUser;
  // Listen to heart document for currently logged in user
  const heartRef = auth.currentUser
    ? postRef.collection("hearts").doc(auth.currentUser.uid)
    : undefined;

  // Create a user-to-post relationship
  const addHeart = async (id: string) => {
    const uid = id;
    const batch = firestore.batch();

    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  };

  return currentlySignedInUser && ownPost ? (
    <button
      className="HeartButton"
      onClick={() => addHeart(currentlySignedInUser.uid)}
    >{`${count} 👏`}</button>
  ) : (
    <p className="HeartCount">{`${count} 👏`}</p>
  );
};
