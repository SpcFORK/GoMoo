function encodeUTF8(string) {
  const utf8 = [];
  for (let i = 0; i < string.length; i++) {
    let charcode = string.charCodeAt(i);
    if (charcode < 0x80) utf8.push(charcode);
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(
        0xe0 | (charcode >> 12),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f),
      );
    } else {
      // surrogate pair
      i++;
      charcode =
        0x10000 + (((charcode & 0x3ff) << 10) | (string.charCodeAt(i) & 0x3ff));
      utf8.push(
        0xf0 | (charcode >> 18),
        0x80 | ((charcode >> 12) & 0x3f),
        0x80 | ((charcode >> 6) & 0x3f),
        0x80 | (charcode & 0x3f),
      );
    }
  }
  return new Uint8Array(utf8);
}

function decodeUTF8(uint8Array) {
  let result = "";
  let i = 0;
  while (i < uint8Array.length) {
    let value = uint8Array[i++];
    if (value < 0x80) {
      result += String.fromCharCode(value);
    } else if (value >= 0xc0 && value < 0xe0) {
      result += String.fromCharCode(
        ((value & 0x1f) << 6) | (uint8Array[i++] & 0x3f),
      );
    } else if (value >= 0xe0 && value < 0xf0) {
      result += String.fromCharCode(
        ((value & 0x0f) << 12) |
          ((uint8Array[i++] & 0x3f) << 6) |
          (uint8Array[i++] & 0x3f),
      );
    } else if (value >= 0xf0) {
      let charCode =
        (((value & 0x07) << 18) |
          ((uint8Array[i++] & 0x3f) << 12) |
          ((uint8Array[i++] & 0x3f) << 6) |
          (uint8Array[i++] & 0x3f)) -
        0x10000;
      result += String.fromCharCode(
        0xd800 + (charCode >> 10),
        0xdc00 + (charCode & 0x3ff),
      );
    }
  }
  return result;
}

const eobj = {
  encodeUTF8,
  decodeUTF8,
}

if (typeof module !== "undefined") module.exports = eobj;
if (typeof window !== "undefined") window.utf8E = eobj;