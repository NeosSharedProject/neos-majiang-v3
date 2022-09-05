import React, { useEffect, useRef, useState } from "react";
import { Hai, Model } from "../../../lib/majiang/types";
import _ from "lodash";
import haiEmojiMap from "./haiEmojiMap";
import { WsEvent } from "../types";

function isHai(hai: string): hai is Hai {
  const result = new RegExp("^[mspz][0-9][\\*_+=-]?$").test(hai);
  if (!result) {
    console.debug("isHAi false. hai=", hai);
  }
  return result;
}

function analysisHai(hai: Hai) {
  return {
    type: hai.substring(0, 1),
    num: Number(hai.substring(1, 2)),
    state: hai.substring(2, 3),
  };
}

function isAka(hai: Hai) {
  const { num } = analysisHai(hai);
  return num === 0;
}

function getHaiEmoji(hai: Hai) {
  const { type, num } = analysisHai(hai);
  return _.get(haiEmojiMap, isAka(hai) ? `${type}5` : `${type}${num}`);
}

function HaiView({ hai }: { hai: Hai }) {
  const { state } = analysisHai(hai);
  const style = {
    ...(() => {
      switch (state) {
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
    })(),
    ...(isAka(hai) ? { color: "red" } : {}),
  };
  return (
    <div style={style}>
      {/* ${hai} */}
      {getHaiEmoji(hai)}
    </div>
  );
}

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
        {he._pai.map((hai) => HaiView({ hai }))}
      </div>
      <div style={{ display: "flex" }}>
        手牌：
        {tehaiList.map((hai) => {
          if (!isHai(hai)) {
            return;
          }
          return (
            <button
              onClick={() => {
                window.alert(hai);
              }}
              style={
                isAka(hai)
                  ? {
                      color: "red",
                    }
                  : {}
              }
            >
              {getHaiEmoji(hai)}
            </button>
          );
        })}
        -{isHai(zimo) ? <HaiView hai={zimo} /> : zimo}-
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
      ws.onmessage = (rawEvent: any) => {
        try {
          const event = JSON.parse(rawEvent.data) as WsEvent;
          const { type, model } = event;
          switch (type) {
            case "update":
              setData(model);
              break;
            case "say":
              console.debug(type, event.data.code, event);
              break;
            default:
              console.debug(event);
          }
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
          <div style={{ display: "flex" }}>
            山：
            {data.shan._pai.map((hai) => HaiView({ hai }))}
          </div>
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
          <p>changbang: {data.changbang}</p>
          <p>qijia: {data.qijia}</p>
          <p>lunban: {data.lunban}</p>
          <p>jushu: {data.jushu}</p>
          <p>zhuangfeng: {data.zhuangfeng}</p>
        </>
      )}
    </>
  );
}
