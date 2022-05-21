import { DocumentData, FieldValue } from "firebase/firestore";
import { firestore, postToJSON } from "./firebase";

export const POSTS_PER_REQUEST_LIMIT = 10;

// TODO Extract into separate functions
export const getPosts = async (
  cursor?: FieldValue | number | null,
  userDoc?: DocumentData | null
) => {
  // TODO Simplify
  const postsQuery = cursor
    ? userDoc
      ? userDoc.ref
          .collection("posts")
          .orderBy("createdAt", "desc")
          .startAfter(cursor)
          .limit(POSTS_PER_REQUEST_LIMIT)
      : firestore
          .collectionGroup("posts")
          .orderBy("createdAt", "desc")
          .startAfter(cursor)
          .limit(POSTS_PER_REQUEST_LIMIT)
    : userDoc
    ? userDoc.ref
        .collection("posts")
        .orderBy("createdAt", "desc")
        .limit(POSTS_PER_REQUEST_LIMIT)
    : firestore
        .collectionGroup("posts")
        .orderBy("createdAt", "desc")
        .limit(POSTS_PER_REQUEST_LIMIT);

  try {
    return (await postsQuery.get()).docs.map(postToJSON);
  } catch (error) {
    console.error(error);
  }
};

export const getFilteredPosts = async (filter: string) => {
  const query = firestore
    .collectionGroup("posts")
    .where("country", "==", filter)
    .orderBy("createdAt", "desc")
    .limit(POSTS_PER_REQUEST_LIMIT);
  try {
    return (await query.get()).docs.map(postToJSON);
  } catch (error) {
    console.error(error);
  }
};
