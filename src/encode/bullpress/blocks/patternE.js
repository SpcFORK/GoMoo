const eobj = {
  isPattern: /(([^]+?)\2{2,})/g,
  reg: /(([^]+?)\2+)/g,
  unreg: /ͼ(([^]+?)(\d)+)+?ͼ/g,

  encode(input = '') {
    if (input.length === 0) return input;

    return input.replace(this.isPattern, (match, p1, p2) => {
      let matchCount = p1.split(p2).length - 1;

      let res = `ͼ${p2 + matchCount}ͼ`;
      return res;
    });
  },

  decode(input = '') {
    return input.replace(this.unreg, (match, p1, p2, p3) => {
      return p2.repeat(parseInt(p3));
    });
  },
};


if (typeof globalThis.window !== "undefined")
  globalThis.window.BracketEncoder = eobj;
if (typeof module !== "undefined") module.exports = eobj;
