// No Buffer :(, we must manual
const base64 = {
  chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",

  encode(input = "") {
    let chars = this.chars,
      output = "",
      i = 0;

    while (i < input.length) {
      let a = input.charCodeAt(i++),
        b = input.charCodeAt(i++),
        c = input.charCodeAt(i++),
        index1 = a >> 2,
        index2 = ((a & 3) << 4) | (b >> 4),
        index3 = isNaN(b) ? 64 : ((b & 15) << 2) | (c >> 6),
        index4 = isNaN(c) ? 64 : c & 63;

      output += [index1, index2, index3, index4]
        .map((index) => chars[index])
        .join("");
    }

    output = output.replace(/=+$/, "");

    return output;
  },

  decode(input = "") {
    let chars = this.chars,
      output = "",
      i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {
      let index1 = chars.indexOf(input.charAt(i++)),
        index2 = chars.indexOf(input.charAt(i++)),
        index3 = chars.indexOf(input.charAt(i++)),
        index4 = chars.indexOf(input.charAt(i++)),
        a = (index1 << 2) | (index2 >> 4),
        b = ((index2 & 15) << 4) | (index3 >> 2),
        c = ((index3 & 3) << 6) | index4;

      output += String.fromCharCode(a);
      if (index3 !== 64) output += String.fromCharCode(b);
      if (index4 !== 64) output += String.fromCharCode(c);
    }

    output = output.replace(/[\x00\uffff]+$/g, "");

    return output;
  },
};

if (typeof globalThis.window !== "undefined") globalThis.window.base64 = base64;

if (typeof globalThis.Buffer !== "undefined")
  module.exports = {
    encode(input) {
      return globalThis.Buffer.from(input).toString("base64");
    },

    decode(input) {
      return globalThis.Buffer.from(input, "base64").toString("ascii");
    },
  };
else if (typeof module !== "undefined") module.exports = base64;
