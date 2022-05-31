import "../styles/Splash.css";

type SplashProps = {
  show: boolean;
};

export const Splash = ({ show }: SplashProps) => {
  return (
    <div className={`Splash ${show ? "" : "m-hide"}`}>
      <img
        className="Splash__logo"
        src={require("../assets/band-name-logo.png")}
        alt="BandName! logo"
      />
    </div>
  );
};
