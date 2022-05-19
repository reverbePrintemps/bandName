import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";
import { firestore, serverTimestamp } from "../lib/firebase";
import { FormEvent, useState } from "react";
import { AuthCheck } from "./AuthCheck";
import { Card, CardKind } from "./Card";
import { useNavigate } from "react-router-dom";
import { Post } from "./Feed";

// const taunts = [
//   "Get typing, douchebag..",
//   "Let's see what you got, big guy.",
//   "C'mon hotshot, the stage is all yours",
//   "Think you’re funny, huh? Prove it.",
//   "Stupid-a facking game-a",
// ];

// const taunts = [
//   "Get typing...",
//   "Whatchu got?",
//   "C'mon hotshot..",
//   "Think you’re funny?",
// ];

// const genres = [
//   "Progressive Death Metal",
//   "Gypsy Metal",
//   "Country Blues Metal",
//   "Heavy Metal Metal",
//   "Folk Opera Metal",
//   "Traditional Speed Metal",
// ];

// TODO Find correct type
type CreateNewPostProps = {
  user: any;
};

export const CreateNewPost = ({ user }: CreateNewPostProps) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [country, setCountry] = useState("");

  // const randomTaunt = useMemo(
  //   () => taunts[Math.floor(Math.random() * taunts.length)],
  //   []
  // );
  // const randomGenre = useMemo(
  //   () => genres[Math.floor(Math.random() * genres.length)],
  //   []
  // );
  // const randomCountry = useMemo(
  //   () => COUNTRY_FLAGS[Math.floor(Math.random() * COUNTRY_FLAGS.length)].flag,
  //   []
  // );

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  const username = user.username;

  // Create a new post in firestore
  const createPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // TODO Silly
    const uid = user.user.uid;
    const ref = firestore
      .collection("users")
      .doc(uid)
      .collection("posts")
      .doc(slug);

    // Tip: give all fields a default value here
    const data: Post = {
      title,
      genre,
      country,
      slug,
      uid,
      username,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await ref.set(data);

    toast.success("Post created!");

    // Imperative navigation after doc is set
    setTimeout(() => {
      navigate(0);
    }, 3000);
  };

  return (
    <AuthCheck>
      <Card
        kind={CardKind.Submit}
        onSubmit={(e) => createPost(e)}
        onTitleChange={(title) => setTitle(title)}
        titlePlaceholder={"Enter band name"}
        onGenreChange={(genre) => setGenre(genre)}
        genrePlaceholder={"Enter genre"}
        genre={genre}
        // TODO Could be better
        countryPlaceholder={"Country"}
        country={country}
        onCountryChange={(country) => setCountry(country)}
        username={username}
        isValid={isValid}
        title={title}
      />
    </AuthCheck>
  );
};
