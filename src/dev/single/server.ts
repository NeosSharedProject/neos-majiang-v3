import Game from "../../lib/majiang/game";
import Player from "../../lib/majiang-ai/0502/player";
import express from "express";
import http from "http";
import ws from "ws";

class View {
  _param: any;
  _say: any;
  game: Game;
  ws: any;
  constructor(game: Game) {
    game.view = this;
    this.game = game;
  }

  render() {
    if (this.ws) {
      this.ws.send(JSON.stringify(this.game.model));
    }
  }

  kaiju(param: any) {
    this.render();
    this._param = { kaiju: param };
  }
  redraw(param: any) {
    this.render();
    this._param = { redraw: param };
  }
  update(param: any) {
    this.render();
    this._param = { update: param };
  }
  say(...param: any) {
    this.render();
    this._say = param;
  }
  summary(param: any) {
    this.render();
    this._param = { summary: param };
  }
}

async function generateGame() {
  const players = [0, 1, 2, 3].map((num) => new Player());
  const game = new Game(players);
  new View(game);
  game.kaiju();
  return game;
}

const app = express();
const server = http.createServer(app);
const wss = new ws.Server({ server });

let game: Game | undefined = undefined;

app.use("/", express.static(__dirname + "/build"));

app.post("/api/entry/", async (req: express.Request, res: express.Response) => {
  game = await generateGame();
  res.send("ok");
});

wss.on("connection", (ws) => {
  if (game) {
    game._view.ws = ws;
  }
});

server.listen(3000, () => console.log("dev single ok"));
