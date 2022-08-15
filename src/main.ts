import Game from "./lib/majiang/game";
import Player from "./lib/majiang/player";
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
} from "./lib/majiang/types";

class TestPlayer extends Player {
  constructor() {
    super();
  }

  action_kaiju(kaiju: Kaiju) {
    this?._callback();
  }

  action_qipai(qipai: Qipai) {
    this?._callback();
  }

  action_zimo(zimo: Zimo | null, gangzimo: Gangzimo | null) {
    console.log(zimo);
    this?._callback();
  }

  action_dapai(dapai: Dapai) {
    this?._callback();
  }

  action_fulou(fulou: Fulou) {
    this?._callback();
  }

  action_gang(gang: Gang) {
    this?._callback();
  }

  action_hule(hule: Hule) {
    this?._callback();
  }

  action_pingju(pingju: Pingju) {
    this?._callback();
  }

  action_jieju(paipu: Paipu) {
    this?._callback();
  }
}

const players = [0, 1, 2, 3].map((num) => new TestPlayer());
const game = new Game(players);
game.kaiju();
game.qipai();

console.log(game.model.shan._pai);
