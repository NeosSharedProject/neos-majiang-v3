import Player from "../../lib/majiang/player";
import {Dapai, Fulou, Gang, Gangzimo, Hule, Kaiju, Paipu, Pingju, Qipai, Zimo} from "../../lib/majiang/types";

export class WSPlayer extends Player {
    ws: any

    constructor() {
        super();
    }

    action_kaiju(kaiju: Kaiju) {
        this?._callback();
    }

    action_qipai(qipai: Qipai) {
        this?._callback();
    }

    // ツモ
    action_zimo(zimo: Zimo | null, gangzimo: Gangzimo | null) {
        if (zimo?.l != this._menfeng) return this._callback();
        console.log(this._model.shoupai[this._menfeng]._bingpai)
        // this._callback({ dapai: "m3" });
        // this?._callback();
    }

    // 打牌
    action_dapai(dapai: Dapai) {
        // if (dapai?.l !== this._menfeng) {
        //     this?._callback();
        //     return;
        // }
        // console.log("dapai")
        // this._callback({ daopai: "m1" });
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
