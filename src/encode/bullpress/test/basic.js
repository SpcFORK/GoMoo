const { GoMooE1, GoMooE2 } = require("../index");

const bp = GoMooE2;

const fs = require("fs");
const path = require("path");

const str = fs.readFileSync(path.join(__dirname, "../../../../chaz.txt"), 'hex');
// const str = fs.readFileSync(path.join(__dirname, "../../../../minim.txt"), "utf8");
// const str = fs.readFileSync(path.join(__dirname, "../../../../moabs.txt"), "utf8");
// const str = fs.readFileSync(path.join(__dirname, "../../../../wdist/index.js"), "utf8");
// const str = fs.readFileSync(path.join(__dirname, "../../../../dist/index.js"), "utf8");
// const str = fs.readFileSync(path.join(__dirname, "../index.js"), "utf8");
// const str = `Hello World!`
const endStr = str
  // .repeat(12)
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
    encoded
    // encoded.encodedString.length > 1000
    //   ? encoded.encodedString.slice(0, 1000) + "..."
    //   : encoded.encodedString,
  );
  console.log();

  const decoded = bp.decode(encoded.encodedString);
  // console.log("Decoded: ", decoded);
  console.log();

  console.log("OPT: ", encoded.isOptimized);
  console.log();

  for (let i = 0; i < STRING.length; i++) if (STRING[i] != decoded.decodedString[i]) throw new Error("Mismatch at index " + i + " (  " + STRING[i] + "  !=  " + decoded.decodedString[i] + "  )");
  console.log("Same: ", STRING.length, encoded.encodedString.length, STRING.length - encoded.encodedString.length)
}

newFunction(endStr);
// newFunction(STRING);
