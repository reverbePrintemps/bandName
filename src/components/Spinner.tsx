import React from "react";

type Props = { show: boolean };

const Spinner = ({ show }: Props) => {
  return show ? <div className="Spinner"></div> : null;
};

export default Spinner;
