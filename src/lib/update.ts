import { firestore } from "../lib/firebase";

// Utility to be used for updating all documents in db
// Required store rules to be edited as follows:
// match /posts/{postId} {
//     allow read;
//     allow update;
// }

export const updateAllDocs = () =>
  firestore
    .collectionGroup("posts")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.update({
          property: "value",
        });
      });
    });
