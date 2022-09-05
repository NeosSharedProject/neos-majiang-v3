import { Message, Paipu } from "./types";

export default abstract class View {
  abstract kaiju: () => void;
  abstract redraw: () => void;
  abstract update: (message: Message) => void;
  abstract say: (
    code: "zimo" | "gang" | "lizhi" | "rong" | "peng" | "chi",
    player: 0 | 1 | 2 | 3
  ) => void;
  abstract summary: (paipu: Paipu) => void;
}
