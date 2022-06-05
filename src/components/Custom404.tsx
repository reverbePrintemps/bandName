import { Link } from "react-router-dom";
import { CustomButton } from "../components/CustomButton";

import "../styles/Custom404.css";

export const Custom404 = () => {
  return (
    <div className="Custom404">
      <h1>404 - This page does not seem to exist...</h1>
      <iframe
        title="404"
        src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
        width="480"
        height="362"
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <div className="Custom404__button">
        <Link to="/">
          <CustomButton type="button" label="Go Home" />
        </Link>
      </div>
    </div>
  );
};
