const bp = require("../index");

function generateRandomString(length) {
  let s = "";
  for (let i = 0; i < length; i++)
    s += String.fromCharCode(Math.floor(Math.random() * (65535 - 12000)));
  return s;
}

// console.log("Random String: ", randomString);
function testEncodingPerformance() {
  const iterations = 15;
  let totalTime = 0;

  for (let i = 0; i < iterations; i++) {
    const randomString = generateRandomString(bp.CHUNK_LENGTH);

    console.log("Iteration: ", i + 1, "of", iterations, "\n ", totalTime);
    console.log(
      "  String Len: ",
      randomString.length,
      ", \n  String Slice:",
      randomString.slice(0, 10),
      "...\n",
    );

    const start = performance.now();
    const encoded = bp.encode(randomString);
    console.log("  Encode: ", encoded.encodedString.length, "bytes");
    // const decoded = await bp.decodeP(encoded.encodedString);
    const end = performance.now();

    console.log("  PL: ", encoded.presumedTime, "ms");
    totalTime += end - start;
    console.log("  Time: ", (end - start).toFixed(2), "ms\n");
    console.log(
      "  E Slice:",
      encoded.encodedString.slice(0, 2000),
      "...\n",
    );
  }

  console.log(`Average encoding/decoding time: ${totalTime / iterations} ms`);
}

function testDecodingPerformance() {
  const iterations = 15;
  let totalTime = 0;

  for (let i = 0; i < iterations; i++) {
    const randomString = generateRandomString(bp.CHUNK_LENGTH);

    console.log("Iteration: ", i + 1, "of", iterations, "\n ", totalTime);
    console.log(
      "  String Len: ",
      randomString.length,
      ", \n  String Slice:",
      randomString.slice(0, 10),
      "...\n"
    );

    const start = performance.now();
    const decoded = bp.decodeP(randomString);
    console.log("  Decode: ", decoded.length, "bytes");
  }
}

testEncodingPerformance();
