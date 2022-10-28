import Player from "../lib/majiang/player";
import {
  Kaiju,
  Qipai,
  Zimo,
  Gangzimo,
  Dapai,
  Fulou,
  Gang,
  Hule,
  Pingju,
  Paipu,
} from "../lib/majiang/types";
import ws from "ws";

export class NeosPlayer extends Player {
  userId: string;
  playerId: string;
  webSockets: ws.WebSocket[];
  constructor(userId: string, playerId: string) {
    super();
    this.userId = userId;
    this.playerId = playerId;
    this.webSockets = [];
  }

  pushWebSocket(ws: ws.WebSocket) {
    this.webSockets.push(ws);
    ws.onmessage = this.resolveWebSocketMessage;
  }

  resolveWebSocketMessage(event: any) {
    console.log("recieved!");
  }

  action_kaiju(kaiju: Kaiju) {
    console.log(this.userId, "kaiju");
    this?._callback();
  }

  action_qipai(qipai: Qipai) {
    console.log(this.userId, "qipai");
    this?._callback();
  }

  // ツモ
  action_zimo(zimo: Zimo | null, gangzimo: Gangzimo | null) {
    if (zimo?.l !== this._menfeng) {
      this?._callback();
      return;
    }
    console.log(this.userId, "zimo", zimo);
    this.webSockets.forEach((client) => {
      client.send(JSON.stringify(zimo));
    });
    this?._callback();
  }

  // 打牌
  action_dapai(dapai: Dapai) {
    if (dapai?.l !== this._menfeng) {
      this?._callback();
      return;
    }
    console.log(this.userId, "dapai", dapai);
    this?._callback();
  }

  action_fulou(fulou: Fulou) {
    console.log(this.userId, "fulou");
    this?._callback();
  }

  action_gang(gang: Gang) {
    console.log(this.userId, "gang");
    this?._callback();
  }

  action_hule(hule: Hule) {
    console.log(this.userId, "hule");
    this?._callback();
  }

  action_pingju(pingju: Pingju) {
    console.log(this.userId, "pingju");
    this?._callback();
  }

  action_jieju(paipu: Paipu) {
    console.log(this.userId, "jieju");
    this?._callback();
  }
}
