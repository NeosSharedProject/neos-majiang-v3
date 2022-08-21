import React, { useEffect, useRef, useState } from "react";
import { Model } from "../../../lib/majiang/types";
import _ from "lodash";
import haiEmojiMap from "./haiEmojiMap";

function Seat({
  shoupai,
  he,
  player,
  defen,
}: {
  shoupai: Model["shoupai"][0];
  he: Model["he"][0];
  player: any;
  defen: number;
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

  const fulouList = shoupai._fulou.map((mentu) => {
    const haiType = mentu.substring(0, 1);
    const nMentuStr = mentu.replace("+", "").replace("=", "").replace("-", "");
    const target = _.find(
      mentu,
      (str) => str === "+" || str === "=" || str === "-",
      undefined
    );
    const sRotatedHaiInbdex =
      Number(
        _.max([mentu.indexOf("+"), mentu.indexOf("="), mentu.indexOf("-")])
      ) - 2;
    const type =
      nMentuStr.length === 4
        ? !target
          ? "ankan"
          : nMentuStr.substring(1, 2).replace("0", "5") ===
            nMentuStr.substring(2, 3).replace("0", "5")
          ? "pon"
          : "chii"
        : mentu.substring(4, 5) === "+" ||
          mentu.substring(4, 5) === "=" ||
          mentu.substring(4, 5) === "-"
        ? "minkan"
        : "kakan";
    const sHaiList = _.range(nMentuStr.length - 1).map((num) => {
      return `${haiType}${nMentuStr.substring(num + 1, num + 2)}`;
    });
    const fHaiList = sHaiList.filter(
      (_v, index) => index !== sRotatedHaiInbdex
    );
    const rotatedHai = sHaiList[sRotatedHaiInbdex];
    return {
      haiList: (() => {
        switch (target) {
          case "+":
            return [fHaiList[0], fHaiList[1], rotatedHai, ...fHaiList.slice(2)];
          case "=":
            return [fHaiList[0], rotatedHai, ...fHaiList.slice(1)];
          case "-":
            return [rotatedHai, ...fHaiList];
          default:
            return sHaiList;
        }
      })(),
      rotatedHaiInbdex: _.get(
        {
          "+": 2,
          "=": 1,
          "-": 0,
        },
        target ?? ""
      ),
      target,
      type,
    };
  });

  return (
    <>
      <div>
        {player}-{defen}
      </div>
      <div style={{ display: "flex" }}>
        捨牌：
        {he._pai.map((hai) => {
          const style = (() => {
            switch (hai.substring(2, 3)) {
              case "_":
                return { background: "gray" };
              case "*":
                return { transform: "rotate(90deg)" };
              case "+":
                return { opacity: 0.4 };
              case "=":
                return { opacity: 0.4 };
              case "-":
                return { opacity: 0.4 };
              default:
                return {};
            }
          })();
          return (
            <div style={style}>{_.get(haiEmojiMap, hai.substring(0, 2))}</div>
          );
        })}
      </div>
      <div style={{ display: "flex" }}>
        手牌：
        {tehaiList.map((hai) => (
          <div>{_.get(haiEmojiMap, hai)}</div>
        ))}
        -{_.get(haiEmojiMap, zimo)}-
        {fulouList.map((mentu) => {
          return (
            <>
              {mentu.haiList.map((hai, index) => {
                const isRotated = index === mentu.rotatedHaiInbdex;
                return (
                  <div style={isRotated ? { transform: `rotate(90deg)` } : {}}>
                    {_.get(haiEmojiMap, hai)}
                  </div>
                );
              })}
            </>
          );
        })}
      </div>
    </>
  );
}

export default function Game({ sessionId }: { sessionId: string }) {
  const [data, setData] = useState<Model | undefined>(undefined);
  const wsRef = useRef<WebSocket | undefined>(undefined);

  useEffect(() => {
    if (!wsRef.current || wsRef.current.CLOSED) {
      const ws = new WebSocket("ws://localhost:3000/");
      ws.onmessage = (event: any) => {
        try {
          setData(JSON.parse(event.data));
        } catch (e) {
          console.error(e);
        }
      };
      wsRef.current = ws;
    }
  }, [sessionId]);

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
                defen={data.defen[num]}
              />
            );
          })}
        </>
      )}
    </>
  );
}
