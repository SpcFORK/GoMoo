const { lzwCompress } = class LZWC {
  static lzwCompress(input) {
    return new LZWC(input).output.join("");
  }

  inputArray = [];
  currentChar = "";

  dictionary = {};
  output = [];
  dictSize = 256;

  getChar() {
    return this.dictionary[this.currentChar];
  }

  getNextChar(i) {
    return this.inputArray[i];
  }

  getIndSet(
    i,
    nextChar = this.getNextChar(i),
    ind = this.currentChar + nextChar,
  ) {
    return [nextChar, ind];
  }

  pushOut() {
    return this.output.push(
      this.currentChar.length > 1
        ? this.getChar()
        : this.currentChar.charCodeAt(0),
    );
  }

  constructor(input) {
    this.inputArray = input.split("");
    this.currentChar = this.inputArray[0];
    this.mutate();
  }

  mutate() {
    for (let i = 1, nextChar, ind; i < this.inputArray.length; i++) {
      [nextChar, ind] = this.getIndSet(i);
      if (this.dictionary[ind] != null) this.currentChar += nextChar;
      else {
        this.pushOut();
        this.dictionary[ind] = this.dictSize++;
        this.currentChar = nextChar;
      }
    }
    this.pushOut();

    this.output = this.output.map((char) => String.fromCharCode(char));
  }
};

const { lzwDecompress } = class LZCD {
  static lzwDecompress(compressed) {
    return new LZCD(compressed).result.join("");
  }

  dictionary = {};
  dictSize = 256;
  code = this.dictSize;

  compressedArray = [];
  _char = "";
  previousChar = "";
  currentChar = "";
  result = [];

  curAndPrev() {
    return this.previousChar + this.currentChar;
  }

  getEntry(i) {
    let char = this.compressedArray[i],
      currentCode = char.charCodeAt(0),
      entry =
        this.dictSize > currentCode
          ? char
          : this.dictionary[currentCode] || this.curAndPrev();
    return entry;
  }

  mutate() {
    for (let i = 1; i < this.compressedArray.length; i++) {
      let entry = this.getEntry(i);
      this.result.push(entry);
      this.currentChar = entry.charAt(0);
      this.dictionary[this.code] = this.curAndPrev();
      this.code++;
      this.previousChar = entry;
    }
  }

  constructor(compressed) {
    this.compressedArray = compressed.split("");
    this._char = this.compressedArray[0];
    this.currentChar = this._char;
    this.previousChar = this._char;
    this.result = [this.currentChar];
    this.mutate();
  }
};

const eobj = {
  lzwCompress,
  lzwDecompress,
};

if (typeof module !== "undefined") module.exports = eobj;
if (typeof window !== "undefined") window.lzw = eobj;
