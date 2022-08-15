// @ts-nocheck
/*
 *  Majiang.He
 */
"use strict";
import Shoupai from "./shoupai";

export default class He {
  _pai: [];
  _find: any;

  constructor() {
    this._pai = [];
    this._find = {};
  }

  dapai(p: Hai) {
    if (!Shoupai.valid_pai(p)) throw new Error(p);
    this._pai.push(p.replace(/[\+\=\-]$/, ""));
    this._find[p[0] + (+p[1] || 5)] = true;
    return this;
  }

  fulou(m: Mentu) {
    if (!Shoupai.valid_mianzi(m)) throw new Error(m);
    let p = m[0] + m.match(/\d(?=[\+\=\-])/),
      d = m.match(/[\+\=\-]/);
    if (!d) throw new Error(m);
    if (this._pai[this._pai.length - 1].substr(0, 2) != p) throw new Error(m);
    this._pai[this._pai.length - 1] += d;
    return this;
  }

  find(p: Hai) {
    return this._find[p[0] + (+p[1] || 5)];
  }
}
