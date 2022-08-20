import React, { useEffect, useRef, useState } from "react";
import { Model } from "../../../lib/majiang/types";
import _ from "lodash";
import haiEmojiMap from "./haiEmojiMap";

function Seat({
  shoupai,
  he,
  player,
}: {
  shoupai: Model["shoupai"][0];
  he: Model["he"][0];
  player: any;
}) {
  const zimo = shoupai._zimo?.substring(0, 2) ?? "";
  const tehaiList = _.flatMap([
    _.flatMap(
      shoupai._bingpai.m.map((num, index) =>
        _.range(`m${index}` === zimo ? num - 1 : num).map(() => `m${index}`)
      )
    ),
    _.flatMap(
      shoupai._bingpai.p.map((num, index) =>
        _.range(`p${index}` === zimo ? num - 1 : num).map(() => `p${index}`)
      )
    ),
    _.flatMap(
      shoupai._bingpai.s.map((num, index) =>
        _.range(`s${index}` === zimo ? num - 1 : num).map(() => `s${index}`)
      )
    ),
    _.flatMap(
      shoupai._bingpai.z.map((num, index) =>
        _.range(`z${index}` === zimo ? num - 1 : num).map(() => `z${index}`)
      )
    ),
  ]);

  return (
    <>
      <div>{player}</div>
      <div>
        捨牌：{he._pai.map((hai) => _.get(haiEmojiMap, hai.substring(0, 2)))}
      </div>
      <div>
        手牌：
        {tehaiList.map((hai) => _.get(haiEmojiMap, hai))}-
        {_.get(haiEmojiMap, zimo)}
      </div>
    </>
  );
}

async function fetcher(url: string) {
  const response = await fetch(url);
  return response.json();
}

export default function Game({ sessionId }: { sessionId: string }) {
  const [gameGnerated, setGameGenerated] = useState<boolean>(false);
  const [data, setData] = useState<Model | undefined>(undefined);

  useEffect(() => {
    fetch("/api/entry", { method: "post" }).then(() => {
      setGameGenerated(true);
    });
  }, []);

  useEffect(() => {
    if (gameGnerated) {
      const ws = new WebSocket("ws://localhost:3000/");
      ws.onmessage = (event: any) => {
        try {
          setData(JSON.parse(event.data));
        } catch (e) {
          console.error(e);
        }
      };
    }
  }, [gameGnerated]);

  return (
    <>
      {data && (
        <>
          <div>山：{data.shan._pai.map((hai) => _.get(haiEmojiMap, hai))}</div>
          {[0, 1, 2, 3].map((num) => {
            return (
              <Seat
                he={data.he[num]}
                shoupai={data.shoupai[num]}
                player={data.player[num]}
              />
            );
          })}
        </>
      )}
    </>
  );
}
