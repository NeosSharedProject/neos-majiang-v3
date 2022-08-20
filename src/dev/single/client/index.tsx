import React from "react";
import ReactDom from "react-dom";
import Game from "./game";

export default function Client() {
  return <Game sessionId="123" />;
}

ReactDom.render(<Client />, document.getElementById("root"));
