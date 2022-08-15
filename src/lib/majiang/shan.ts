// @ts-nocheck

import { Hai, Rule } from "./types";

const Majiang = { Shoupai: require("./shoupai") };

export default class Shan {
  /**
   * インスタンス生成時に指定された ルール。
   */
  _rule: Rule;
  /**
   * 牌山中の牌を表す 牌 の配列。 初期状態では添字 0〜13 が王牌となり、0〜3 がリンシャン牌、4〜8 がドラ表示牌、9〜13 が裏ドラ表示牌として順に使用される。 ツモは常に最後尾から取られる。
   */
  _pai: Hai[];
  /**
   * ドラ表示牌の配列。
   */
  _baopai: Hai[];
  /**
   * 裏ドラ表示牌の配列。
   */
  _fubaopai: Hai[];
  /**
   * 開槓可能なとき true になる。
   */
  _weikaigan: boolean;
  /**
   * 開槓可能なとき true になる。
   */
  _closed: boolean;

  static zhenbaopai(p) {
    if (!Majiang.Shoupai.valid_pai(p)) throw new Error(p);
    let s = p[0],
      n = +p[1] || 5;
    return s == "z"
      ? n < 5
        ? s + ((n % 4) + 1)
        : s + (((n - 4) % 3) + 5)
      : s + ((n % 9) + 1);
  }

  /**
   *
   * @param rule
   */
  constructor(rule: Rule) {
    this._rule = rule;
    let hongpai = rule["赤牌"];

    let pai = [];
    for (let s of ["m", "p", "s", "z"]) {
      for (let n = 1; n <= (s == "z" ? 7 : 9); n++) {
        for (let i = 0; i < 4; i++) {
          if (n == 5 && i < hongpai[s]) pai.push(s + 0);
          else pai.push(s + n);
        }
      }
    }

    this._pai = [];
    while (pai.length) {
      this._pai.push(pai.splice(Math.random() * pai.length, 1)[0]);
    }

    this._baopai = [this._pai[4]];
    this._fubaopai = rule["裏ドラあり"] ? [this._pai[9]] : null;
    this._weikaigang = false;
    this._closed = false;
  }

  /**
   * 次のツモ牌を返す。 牌山固定後に呼び出された場合は例外を発生する。
   * @returns {Hai}
   */
  zimo(): Hai {
    if (this._closed) throw new Error(this);
    if (this.paishu == 0) throw new Error(this);
    if (this._weikaigang) throw new Error(this);
    return this._pai.pop();
  }

  /**
   * リンシャン牌からの次のツモ牌を返す。 牌山固定後に呼び出された場合は例外を発生する。
   * @returns {Hai}
   */
  gangzimo(): Hai {
    if (this._closed) throw new Error(this);
    if (this.paishu == 0) throw new Error(this);
    if (this._weikaigang) throw new Error(this);
    if (this._baopai.length == 5) throw new Error(this);
    this._weikaigang = this._rule["カンドラあり"];
    if (!this._weikaigang) this._baopai.push("");
    return this._pai.shift();
  }

  /**
   * カンドラを増やす。 カンヅモより前に呼び出された場合は例外を発生する。
   */
  kaigang(): Shan {
    if (this._closed) throw new Error(this);
    if (!this._weikaigang) throw new Error(this);
    this._baopai.push(this._pai[4]);
    if (this._fubaopai && this._rule["カン裏あり"])
      this._fubaopai.push(this._pai[9]);
    this._weikaigang = false;
    return this;
  }

  /**
   * 牌山を固定する。
   * @returns {Shan}
   */
  close(): Shan {
    this._closed = true;
    return this;
  }

  /**
   * ツモ可能な残り牌数を返す。
   * @returns {number}
   */
  get paishu(): number {
    return this._pai.length - 14;
  }

  /**
   * ドラ表示牌の配列を返す。
   * @returns {Hai[]}
   */
  get baopai(): Hai[] {
    return this._baopai.filter((x) => x);
  }

  /**
   * 裏ドラ表示牌の配列。
   * @returns {Hai[]}
   */
  get fubaopai(): Hai[] {
    return !this._closed
      ? null
      : this._fubaopai
      ? this._fubaopai.concat()
      : null;
  }
}
