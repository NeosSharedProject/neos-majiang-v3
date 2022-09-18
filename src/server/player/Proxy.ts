import Player from "../../lib/majiang/player";
import {
    Message,
    MessageReply,
} from "../../lib/majiang/types";

export class PlayerProxy extends Player {
    private player: Player

    constructor(c: Player) {
        super();
        this.player = c
    }

    override action(msg: Message, callback: (MessageReply? : MessageReply) => {}) {
        console.log("Proxying",msg)
        this.player.action(msg, callback);
    }
}
