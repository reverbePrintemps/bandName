import { DocumentData } from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAIBSCRfx_k1bH5XiuSMoQDu7sP4jiAekk",
  authDomain: "bandname-8b8ff.firebaseapp.com",
  projectId: "bandname-8b8ff",
  storageBucket: "bandname-8b8ff.appspot.com",
  messagingSenderId: "380634396627",
  appId: "1:380634396627:web:5887214d04fe9b123d2126",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();
// Storage exports
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

// Time stuff
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const increment = firebase.firestore.FieldValue.increment;

// Helper functions

/**`
 * Gets a users/{uid} document with username
 * @param  {string} username
 */
export async function getUserWithUsername(username: string) {
  const usersRef = firestore.collection("users");
  const query = usersRef.where("username", "==", username).limit(1);
  const userDoc = (await query.get()).docs[0];
  return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc: DocumentData) {
  const data = doc.data();
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}
