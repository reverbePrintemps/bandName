import { firestore, auth, serverTimestamp } from "../lib/firebase";
import { UserContext } from "../lib/context";
import { FormEvent, useContext, useMemo, useState } from "react";
import kebabCase from "lodash.kebabcase";
import AuthCheck from "./AuthCheck";
import toast from "react-hot-toast";
import { Card, CardKind } from "./Card";
import { useNavigate } from "react-router-dom";

const taunts = [
  "Let's see what you got, big guy.",
  "C'mon hotshot, the stage is all yours",
  "Think you’re funny, huh? Prove it.",
  "Stupid-a facking game-a",
];

const genres = [
  "Progressive Death Metal",
  "Gypsy Metal",
  "Country Blues Metal",
  "Heavy Metal Metal",
  "Folk Opera Metal",
  "Traditional Speed Metal",
];

export const CreateNewPost = () => {
  const navigate = useNavigate();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [country, setCountry] = useState<string | null>("");

  const randomTaunt = useMemo(
    () => taunts[Math.floor(Math.random() * taunts.length)],
    []
  );
  const randomGenre = useMemo(
    () => genres[Math.floor(Math.random() * genres.length)],
    []
  );

  // Ensure slug is URL safe
  const slug = encodeURI(kebabCase(title));

  // Validate length
  const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uid = auth?.currentUser?.uid;
    const ref = firestore
      .collection("users")
      .doc(uid)
      .collection("posts")
      .doc(slug);

    // Tip: give all fields a default value here
    const data = {
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
        kind={CardKind.CreateNew}
        onSubmit={(e) => createPost(e)}
        onTitleChange={(title) => setTitle(title)}
        titlePlaceholder={randomTaunt}
        onGenreChange={(genre) => setGenre(genre)}
        genrePlaceholder={randomGenre}
        genre={genre}
        // TODO Could be better
        country={country ?? ""}
        onCountryChange={(country) => setCountry(country)}
        isValid={isValid}
        title={title}
      />
    </AuthCheck>
  );
};
