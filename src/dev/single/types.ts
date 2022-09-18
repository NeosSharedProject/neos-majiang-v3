import { Message, Model, Paipu } from "../../lib/majiang/types";

export type WsEventUpdate = {
  type: "update";
  data: Message;
  model: Model;
};

export type WsEventSay = {
  type: "say";
  data: {
    code: "zimo" | "gang" | "lizhi" | "rong" | "peng" | "chi";
    player: 0 | 1 | 2 | 3;
  };
  model: Model;
};

export type WsEventRedraw = { type: "redraw"; model: Model };

export type WsEventKaiju = { type: "kaiju"; model: Model };

export type WsEventSummary = { type: "summary"; data: Paipu; model: Model };

export type WsEvent =
  | WsEventUpdate
  | WsEventSay
  | WsEventRedraw
  | WsEventRedraw
  | WsEventSummary;
