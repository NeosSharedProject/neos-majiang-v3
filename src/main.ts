import NeosGame from "./neosgame";
import Player from "./lib/majiang/player";
import ws from "ws";
import http from "http";
import express from "express";
import { v4 as uuidV4 } from "uuid";
import j2e from "json2emap";

import { NeosPlayer } from "./neosPlayer";

const webApi = express();
const server = http.createServer(webApi);
const wss = new ws.Server({ server: server });

webApi.use(express.json());
const port = process.env.port || 3000;

let game: NeosGame | null;

webApi.post("/entry", (req: express.Request, res: express.Response) => {
  const body: any = req.body; // BODY TODO
  if (body.length !== 4) {
    res.status(400).send("BAD_REQUEST");
    return;
  }
  const sessionId = uuidV4();
  const playerIds = [uuidV4(), uuidV4(), uuidV4(), uuidV4()];

  const players = [0, 1, 2, 3].map(
    (num) => new NeosPlayer(body[num], playerIds[num])
  );
  game = new NeosGame(players);
  game.kaiju();
  // game.qipai();

  res.send(j2e({ sessionId, playerIds }));
});

wss.on("connection", function connection(ws, request) {
  const requestUrl = request.url?.split("/");
  if (!requestUrl) return;
  const uuid = requestUrl[2];
  console.log(uuid);
  const player = game?.getPlayerFromUuid(uuid);
  player?.pushWebSocket(ws);
  console.log("connection recieved", player?.userId);
  // ws.on("message", function incoming(message) {
  //   wss.clients.forEach(function each(client) {
  //     client.send(message.toString());
  //   });
  // });
});

server.listen(port, () => console.log("api ok"));
