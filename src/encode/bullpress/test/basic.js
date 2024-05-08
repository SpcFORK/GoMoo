const bp = require("../index");

const fs = require("fs");
const path = require("path");

// const STRING = fs.readFileSync(path.join(__dirname, "../../../../wdist/index.js"), "utf8");
// const STRING = fs.readFileSync(path.join(__dirname, "../../../../dist/index.js"), "utf8");
// const STRING = fs.readFileSync(path.join(__dirname, "../index.js"), "utf8");
const STRING = `Hello World!`
const endStr = STRING.repeat(100)
  // .repeat(100)
  // .repeat(100);

// console.log("String: ", STRING);
// console.log();

// console.log(
//   '"',
//   bp.base64.decode(
//     bp.base64.encode(STRING)
//   ),
//   '"',
// )

function newFunction(STRING = '') {
  const encoded = bp.encode(STRING);
  console.log(
    "Encoded: ",
    encoded.asUInt8()
    // encoded.encodedString.length > 1000
    //   ? encoded.encodedString.slice(0, 1000) + "..."
    //   : encoded.encodedString,
  );
  console.log();

  const decoded = bp.decodeBPUInt8(encoded.asUInt8());
  console.log("Decoded: ", decoded);
  console.log();

  console.log("OPT: ", encoded.isOptimized);
  console.log("Result: ", decoded === STRING);
  console.log();
  // Matches
  // console.log("Matches: ", [...STRING.matchAll(endStr)].length == [...decoded.decodedString.matchAll(endStr)].length)
  
}

newFunction(endStr);
// newFunction(STRING);
