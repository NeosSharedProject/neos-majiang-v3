export type Rule = {
  /* 点数関連 */
  配給原点: number;
  順位点: [string, string, string, string]; //["20.0", "10.0", "-10.0", "-20.0"]

  /* 赤牌有無/クイタンなど */
  赤牌: { m: number; p: number; s: number };
  クイタンあり: boolean;
  喰い替え許可レベル: 0 | 1 | 2;
  // 0: 喰い替えなし, 1: スジ喰い替えあり,  2: 現物喰い替えもあり

  /* 局数関連 */
  場数: 0 | 1 | 2 | 4;
  // 0: 一局戦, 1: 東風戦, 2： 東南戦, 4: 一荘戦
  途中流局あり: boolean;
  流し満貫あり: boolean;
  ノーテン宣言あり: boolean;
  ノーテン罰あり: boolean;
  最大同時和了数: 1 | 2 | 3;
  // 1: 頭ハネ, 2: ダブロンあり, 3: トリロンあり
  連荘方式: number;
  // 0: 連荘なし, 1: 和了連荘, 2: テンパイ連荘, 3: ノーテン連荘
  トビ終了あり: boolean;
  オーラス止めあり: boolean;
  延長戦方式: 0 | 1 | 2 | 3;
  // 0: 延長戦なし, 1: サドンデス, 2: 連荘優先サドンデス, 3: 4局固定

  /* リーチ/ドラ関連 */
  一発あり: boolean;
  裏ドラあり: boolean;
  カンドラあり: boolean;
  カン裏あり: boolean;
  カンドラ後乗せ: boolean;
  ツモ番なしリーチあり: boolean;
  リーチ後暗槓許可レベル: 0 | 1 | 2;
  // 0: 暗槓不可, 1: 牌姿の変わる暗槓不可, 2： 待ちの変わる暗槓不可

  /* 役満関連 */
  役満の複合あり: boolean;
  ダブル役満あり: boolean;
  数え役満あり: boolean;
  役満パオあり: boolean;
  切り上げ満貫あり: boolean;
};

/**
 * 開局 (kaiju)
 * ゲームの開始
 */
export type MessageKaiju = {
  /** 開局 */
  kaiju: {
    /** 席順。(0: 仮東、1: 仮南、2: 仮西、3: 仮北) */
    id: number;
    /** ルール。 */
    rule: Rule;
    /** 牌譜のタイトル。 */
    title: string;
    /** 対局者情報。仮東から順に並べる。 */
    player: [string, string, string, string];
    /** 起家。(0: 仮東、1: 仮南、2: 仮西、3: 仮北) */
    qijia: number;
  };
};

/**
 * 配牌 (qipai)
 * 一局の開始
 */
export type MessageQipai = {
  /** 配牌 */
  qipai: {
    /** 場風。(0: 東、1: 南、2: 西、3: 北) */
    zhuangfeng: number;
    /** 局数。(0: 一局、1: 二局、2: 三局、3: 四局) */
    jushu: number;
    /** 本場。 */
    changbang: number;
    /** その局開始時の供託リーチ棒の数。 */
    lizhibang: number;
    /** その局開始時の対局者の持ち点。その局の東家から順に並べる。 */
    defen: [number, number, number, number];
    /** ドラ表示牌。 */
    baoapi: Hai;
    /** 配牌の牌姿。その局の東家から順に並べる。他家の配牌はマスクして通知される。 */
    shoupai: [Haisi, Haisi, Haisi, Haisi];
  };
};

/**
 * 自摸 (zimo)
 */
export type MessageZimo = {
  /** 自摸 */
  zimo: {
    /** 手番。(0: 東家、1: 南家、2: 西家、3: 北家) */
    l: number;
    /** 切った牌。 */
    p: Hai;
  };
};

/**
 * 打牌 (dapai)
 */
export type MessageDapai = {
  /** 打牌 */
  dapai: {
    /** 手番。(0: 東家、1: 南家、2: 西家、3: 北家) */
    l: number;
    /** 切った 牌。 */
    p: Hai;
  };
};

/**
 * 副露 (fulou)
 */
export type MessageFulou = {
  /** 副露 */
  fulou: {
    /** 手番。(0: 東家、1: 南家、2: 西家、3: 北家) */
    l: number;
    /** 副露した面子。 */
    m: Mentu;
  };
};

/**
 * 槓 (gang)
 */
export type MessageGang = {
  /** 槓 */
  gang: {
    /** 手番。(0: 東家、1: 南家、2: 西家、3: 北家) */
    l: number;
    /** 槓した 面子。大明槓は副露として扱うので、ここでの槓は暗槓もしくは加槓。 */
    m: Mentu;
  };
};

/**
 * 槓自摸 (gangzimo)
 */
export type MessageGangzimo = {
  /** 槓自摸 */
  gangzimo: {
    /** 手番。(0: 東家、1: 南家、2: 西家、3: 北家) */
    l: number;
    /** ツモった 牌。 */
    p: Hai;
  };
};

/**
 * 開槓 (kaigang)
 */
export type MessageKaigang = {
  /** 開槓 */
  kaigang: {
    /** ドラ表示牌。 */
    baopai: Hai;
  };
};

/**
 * 和了 (hule)
 */
export type MessageHule = {
  /** 和了 */
  hule: {
    /** 和了者。(0: 東家、1: 南家、2: 西家、3: 北家) */
    l: number;
    /** 和了者の牌姿。ロン和了の場合は和了牌をツモした牌姿にする。 */
    shoupai: Haisi;
    /** 放銃者。ツモ和了の場合は null。 */
    baojia: number | null;
    /** 裏ドラ表示牌の配列。リーチでない場合は null。 */
    fubaopai: string[] | null;
    /** 符。役満の場合は undefined。 */
    fu: number | undefined;
    /** 翻数。役満の場合は undefined。 */
    fanshu: number | undefined;
    /** 役満複合数。複合には四暗刻をダブル役満にする類のものと、大三元と字一色の複合のような役の複合のケースがある。役満でない場合は undefined。 */
    damanguan: number | undefined;
    /** 和了打点。供託収入は含まない。 */
    defen: number;
    /** 和了役の配列。 */
    hupai: MessageHule_Hupai[];
    /** 供託を含めたその局の点数の収支。その局の東家から順に並べる。リーチ宣言による1000点減は収支に含めない。 */
    fenpai: [number, number, number, number];
  };
};

/**
 * 和了役。
 * それぞれの要素には役名を示す name と翻数を示す fanshu がある。
 * 役満の場合 fanshu は数字ではなく、和了役それぞれの役満複合数分の * となる。
 * また役満のパオがあった場合は baojia に責任者を設定する。
 * 役名は任意の文字列なので、ローカル役の採用も可能。
 */
export type MessageHule_Hupai = {
  /** 役名 */
  name: string;
  /**
   * 翻数。
   * 役満の場合 fanshu は数字ではなく、和了役それぞれの役満複合数分の * となる。
   */
  fanshu:
    | number
    | "*"
    | "**"
    | "***"
    | "****"
    | "*****"
    | "******"
    | "*******"
    | "********"
    | "*********";
  /** 責任者 */
  baojia: number | null;
};

/**
 * 流局
 */
export type MessagePingju = {
  /** 流局 */
  pingju: {
    /** 流局理由。 */
    name: string;
    /** 流局時の手牌。その局の東家から順に並べる。ノーテンなどの理由により手牌を開示しなかった場合は空文字列とする。 */
    shoupai: [string, string, string, string];
    /** ノーテン罰符などその局の点数の収支。その局の東家から順に並べる。リーチ宣言による1000点減は収支に含めない。 */
    fenpai: [number, number, number, number];
  };
};

/** 終局 */
export type MessageJieju = {
  /** 終局 */
  jieju: any;
};

//ここから応答メッセージ
/** 打牌 */
export type MessageDapaiReply = {
  /** 切る牌。 */
  dapai: Hai;
};

/** 副露 */
export type MessageFulouReply = {
  /** 副露する 面子。 */
  fulou: Mentu;
};

/** 槓 */
export type MessageGangReply = {
  /** 槓する面子。 */
  gang: Mentu;
};

/** 和了 */
export type MessageHuleReply = {
  hule: string;
};

/** 倒牌 */
export type MessageDaopaiReply = {
  daopai: string;
};

/**
 * Wiki: https://github.com/kobalab/majiang-core/wiki/%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8
 */
export type Message =
  | MessageKaiju
  | MessageQipai
  | MessageZimo
  | MessageDapai
  | MessageFulou
  | MessageGang
  | MessageGangzimo
  | MessageKaigang
  | MessageHule
  | MessagePingju
  | MessageJieju;

export type MessageReply =
  | MessageDapaiReply
  | MessageFulouReply
  | MessageGangReply
  | MessageHuleReply
  | MessageDaopaiReply;

export type Paipu = {
  title: string;
  player: [string, string, string, string];
  qijia: 0 | 1 | 2 | 3;
  log: Message[];
  defen: [number, number, number, number];
  rank: [number, number, number, number];
  point: [string, string, string, string];
};

//export type HaiName = string;
export type Hai =
  | `${"m" | "p" | "s" | "z"}${
      | "0"
      | "1"
      | "2"
      | "3"
      | "4"
      | "5"
      | "6"
      | "7"
      | "8"
      | "9"}${"_" | "*" | "+" | "=" | "-" | ""}`
  | "_";

/**
 * 面子(メンツ)を表す文字列
  - 1文字目は牌種を表す。m: 萬子、p: 筒子、s: 索子、z: 字牌。
  - 数字は牌種内での順序を表す。0は赤牌。字牌の場合、1〜4が風牌、5〜7が三元牌。
  - 数字の直後の文字が + = - の場合、鳴いたことを表す。 +: 下家の打牌を鳴いた、=: 対面の打牌を鳴いた、-: 上家の打牌を鳴いた。
  - ポンの場合、+ = - は末尾につける。大明槓も同様。
  - 加槓の場合、ポンの面子の末尾に牌(数字のみ)を付加する。
  - 数字は1から順に並ぶよう正規化する。0は5の次とする。
 */
export type Mentu = string;

/** 牌姿(ハイシ)
 * 手牌全体を表す文字列
  - 純手牌(副露面子以外の打牌可能な手牌のこと)、副露面子の順に , 区切りで並べる。
  - 純手牌は 牌 を並べて表す。同種の牌が続く場合は牌の1文字目を省略する。
  - 純手牌は、萬子 → 筒子 → 索子 → 字牌(風牌 → 三元牌)の順、同種の牌は数字順に正規化する。0は5の直前とする。
  - 手牌が14枚あるとき(あるいはカンしていてそれに準ずる状況のとき)は、純手牌の最後の1枚が今ツモった牌を表す。ツモった牌は牌種を省略しない。
  - 副露直後も手牌が14枚になるが、ツモ牌はないので牌姿の末尾に , を付与することで上記と異なる表現とする。
  - リーチ後は純手牌の末尾に * を付与し区別する。
  - 副露面子は副露順に 面子 を, 区切りで並べる。
  - 純手牌内の _ は、伏せられていて不明な牌を表す。
 */
export type Haisi = string;
