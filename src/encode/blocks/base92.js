const { encodeBase92, BASE92_ALPHABET } = class EB92 {
  static BASE92_ALPHABET =
    "!#%&()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_abcdefghijklmnopqrstuvwxyz{|}";

  bitstream = 0;
  bitsInBitstream = 0;
  output = "";

  static encodeBase92(input) {
    return new EB92(input).output;
  }

  constructor(input) {
    for (let i = 0; i < input.length; i++) {
      this.bitstream |= input.charCodeAt(i) << this.bitsInBitstream;
      this.bitsInBitstream += 8;

      while (this.bitsInBitstream >= 13) {
        // 2^13 - 1
        let index = this.bitstream & 8191;
        if (index > 88 * 91) {
          index >>= 1;
          this.bitsInBitstream -= 1;
        } else {
          this.bitsInBitstream -= 13;
          this.output +=
            BASE92_ALPHABET[index % 91] +
            BASE92_ALPHABET[Math.floor(index / 91)];
          this.bitstream >>= 13;
        }
      }
    }

    if (this.bitsInBitstream > 0) {
      this.output += BASE92_ALPHABET[this.bitstream % 91];
      if (this.bitsInBitstream > 7 || this.bitstream > 90)
        this.output += BASE92_ALPHABET[Math.floor(this.bitstream / 91)];
    }
  }
};

const { decodeBase92 } = class DB92 {
  bitstream = 0;
  bitsInBitstream = 0;
  output = "";

  constructor(input) {
    for (let i = 0; i < input.length; i += 2) {
      let index1 = BASE92_ALPHABET.indexOf(input[i]);
      let index2 = BASE92_ALPHABET.indexOf(input[i + 1]);

      let value = index1 + 91 * index2;
      this.bitstream |= value << this.bitsInBitstream;
      this.bitsInBitstream += value > 88 * 91 ? 14 : 13;

      while (this.bitsInBitstream >= 8) {
        this.output += String.fromCharCode(this.bitstream & 255);
        this.bitstream >>= 8;
        this.bitsInBitstream -= 8;
      }
    }
  }

  static decodeBase92(input) {
    return new DB92(input).output;
  }
};

let eobj = {
  encodeBase92,
  decodeBase92,
};

if (typeof module !== "undefined") module.exports = eobj;
if (typeof window !== "undefined") window.base92 = eobj;
