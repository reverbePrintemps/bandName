import { useEffect, useState } from "react";

import "../styles/Splash.css";

export const Splash = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 1500);
  }, []);
  return (
    <div className={`Splash ${show ? "m-show" : ""}`}>
      <img
        className="Splash__logo"
        src={require("../assets/band-name-logo.png")}
        alt="BandName! logo"
      />
    </div>
  );
};
