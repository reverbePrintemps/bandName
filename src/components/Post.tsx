import { TelegramShareButton, TelegramIcon } from "react-share";
import { firestore, postToJSON } from "../lib/firebase";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUserData } from "../lib/hooks";
import { ClapButton } from "./ClapButton";
import { Link } from "react-router-dom";
import { PostType } from "./FeedContainer";

export const Post = () => {
  const userData = useUserData();
  const { usernameParam, postId } = useParams();
  const [post, setPost] = useState<PostType>();
  const [userId, setUserId] = useState<string>();

  // TODO Extract to own function
  useEffect(() => {
    (async () => {
      firestore
        .collection("usernames")
        .doc(usernameParam)
        .get()
        .then((doc) => {
          setUserId(doc.data()?.uid);
        });
    })();
  }, [usernameParam]);

  useEffect(() => {
    (async () => {
      firestore
        .collection("users")
        .doc(userId)
        .collection("posts")
        .doc(postId)
        .get()
        .then((doc) => {
          setPost(postToJSON(doc));
        });
    })();
  }, [postId, userId]);

  if (!post) {
    return null;
  }
  const { genre, country, title, username, heartCount, uid, slug } = post;

  const postRef = firestore.doc(`users/${uid}/posts/${slug}`);
  const isOwner = userData.username === username;

  return (
    post && (
      <div className="Card">
        <div className="Card__header">
          <h2 className="Card__title">{title}</h2>
        </div>
        <h3 className="Card__genre">
          <a href={`${process.env.PUBLIC_URL}/genre/${genre}`}>{genre}</a>
        </h3>
        <h3 className="Card__country">
          <a href={`${process.env.PUBLIC_URL}/country/${country}`}>{country}</a>
        </h3>
        <div className="Card__footer">
          <Link className="Card__username" to={`/username/${username}`}>
            <strong>u/{username}</strong>
          </Link>
          <ClapButton ownPost={isOwner} postRef={postRef} count={heartCount} />
        </div>
      </div>
    )
  );
};
