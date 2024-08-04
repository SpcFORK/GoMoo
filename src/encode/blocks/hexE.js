function stringToHex(str) {
  return str
    .split("")
    .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
}

function hexToString(hex) {
  return hex
    .match(/.{1,2}/g)
    .map((hex) => String.fromCharCode(parseInt(hex, 16)))
    .join("");
}

const eobj = {
  stringToHex,
  hexToString,
};

if (typeof window !== "undefined") window.hexE = eobj;
if (typeof module !== "undefined") module.exports = eobj;
