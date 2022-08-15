const Majiang = require("./lib/");

let MSG = [];

class Player {
  constructor(id, reply = [], delay = 0) {
    this._id = id;
    this._reply = reply;
    this._delay = delay;
  }
  action(msg, callback) {
    console.log(`player.action. ${JSON.stringify(msg)} ${callback}`);
    MSG[this._id] = msg;
    if (callback) {
      if (this._delay)
        setTimeout(() => callback(this._reply.shift()), this._delay);
      else callback(this._reply.shift());
    }
  }
}

class View {
  kaiju(param) {
    this._param = { kaiju: param };
    console.log(`view.kaiju. ${JSON.stringify(param)}`);
  }
  redraw(param) {
    this._param = { redraw: param };
    console.log(`view.redraw. ${JSON.stringify(param)}`);
  }
  update(param) {
    this._param = { update: param };
    console.log(`view.update. ${JSON.stringify(param)}`);
  }
  say(...param) {
    this._say = param;
    console.log(`view.say. ${JSON.stringify(param)}`);
  }
  summary(param) {
    this._param = { summary: param };
    console.log(`view.summary. ${JSON.stringify(param)}`);
  }
}

const players = [0, 1, 2, 3].map((id) => new Player(id));
const game = new Majiang.Game(players);
game.view = new View();
game._sync = true;
game.kaiju();
game.qipai();
game.zimo();
game._players;

dapai = game.model.shoupai[0].get_dapai();
game.dapai(dapai[0]);
game.zimo();
dapai = game.model.shoupai[1].get_dapai();
console.log(dapai);
console.log(game.model.)
