import Game from "../lib/majiang/game";
import { Rule } from "../lib/majiang/types";
import { NeosPlayer } from "./neosPlayer";

export default class NeosGame extends Game {
  _players: NeosPlayer[];
  constructor(
    players: NeosPlayer[],
    callback?: () => {},
    rule?: Rule,
    title?: string
  ) {
    super(players, callback, rule, title);
    this._players = players;
  }

  getPlayerFromUuid(uuid: string): NeosPlayer | null {
    return this._players.filter((p) => p.playerId === uuid)[0];
  }
}
