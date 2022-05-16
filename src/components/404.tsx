import { Link } from "react-router-dom";

type Custom404Props = {
  itemNotFound: string;
};

export const Custom404 = ({ itemNotFound }: Custom404Props) => {
  return (
    <main>
      <h1>{`404 - This ${itemNotFound} does not seem to exist...`}</h1>
      <iframe
        title="404"
        src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
        width="480"
        height="362"
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <Link to="/">
        <button className="btn-blue">Go home</button>
      </Link>
    </main>
  );
};
