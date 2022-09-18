import Game from "../../lib/majiang/game";
import Player from "../../lib/majiang-ai/0502/player";
import {PlayerProxy} from "../../server/player/Proxy"
import View from "../../lib/majiang/view";
import express from "express";
import http from "http";
import ws from "ws";
import {Message, Paipu} from "../../lib/majiang/types";
import {WSPlayer} from "../../server/player/WSPlayer";

class NeoView extends View {
    game: Game;
    ws: any;

    constructor(game: Game) {
        super();
        game.view = this;
        this.game = game;
    }

    render(type: string, data?: any) {
        if (this.ws) {
            this.ws.send(JSON.stringify({type, data, model: this.game.model}));
        }
    }

    override kaiju = () => {
        this.render("kaiju");
    };

    override redraw = () => {
        this.render("redraw");
    };

    override update = (data: Message) => {
        this.render("update", data);
    };

    override say = (
        code: "zimo" | "gang" | "lizhi" | "rong" | "peng" | "chi",
        player: 0 | 1 | 2 | 3
    ) => {
        this.render("say", {code, player});
    };

    override summary = (paipu: Paipu) => {
        this.render("summary", paipu);
    };
}

async function generateGame() {
    const players = [0, 1, 2, 3].map((num) => new PlayerProxy(new WSPlayer()));
    const game = new Game(players);
    const view = new NeoView(game);
    game.kaiju();
    return {game, view};
}

const app = express();
const server = http.createServer(app);
const wss = new ws.Server({server});

let data: { game: Game; view: NeoView } | undefined = undefined;

app.use("/", express.static(__dirname + "/build"));

app.post("/api/entry/", async (req: express.Request, res: express.Response) => {
    data = await generateGame();
    res.send("ok");
});

wss.on("connection", (ws) => {
    if (data) {
        data.view.ws = ws;
    }
});

server.listen(3000, () => console.log("dev single ok"));
