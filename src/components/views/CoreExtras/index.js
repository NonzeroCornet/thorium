import React from "react";
import Dice from "./dice";
import Timer from "./timer";
const ExtrasCore = props => {
  return (
    <>
      <Timer {...props} />
      <Dice />
      <Tribble />
    </>
  );
};

export default ExtrasCore;
