import React, { useState } from "react";
import ReactDom from "react-dom";
import Game from "./game";

export default function Client() {
  const [sessionId, setSessionId] = useState<string | undefined>("000");

  return (
    <>
      <button
        onClick={async () => {
          const response = await fetch("/api/entry", { method: "post" });
          setSessionId("123");
        }}
      >
        NewGame
      </button>
      {sessionId && <Game sessionId={sessionId} />}
    </>
  );
}

ReactDom.render(<Client />, document.getElementById("root"));
