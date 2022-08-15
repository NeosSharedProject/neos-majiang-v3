import Game from "./lib/majiang/game";
import Player from "./lib/majiang/player";
import { MessageKaiju } from "./lib/majiang/types";

class TestPlayer extends Player {
  constructor() {
    super();
  }

  action_kaiju(kaiju: MessageKaiju) {
    this?._callback();
  }

  action_qipai(qipai: any) {
    this?._callback();
  }

  action_zimo(zimo: any, gangzimo: any) {
    console.log(zimo);
    this?._callback();
  }

  action_dapai(dapai: any) {
    this?._callback();
  }

  action_fulou(fulou: any) {
    this?._callback();
  }

  action_gang(gang: any) {
    this?._callback();
  }

  action_hule(hule: any) {
    this?._callback();
  }

  action_pingju(pingju: any) {
    this?._callback();
  }

  action_jieju(paipu: any) {
    this?._callback();
  }
}

const players = [0, 1, 2, 3].map((num) => new TestPlayer());
const game = new Game(players);
game.kaiju();
game.qipai();

console.log(game.model.shan._pai);
