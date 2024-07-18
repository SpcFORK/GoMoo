const { GoMooE1 } = require("../index");
const bp = GoMooE1;

function generateRandomString(length) {
  let s = "";
  for (let i = 0; i < length; i++)
    s += String.fromCharCode(Math.floor(Math.random() * (65535 - 12000)));
  return s;
}

async function testEncodingPerformance() {
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

  console.log(`Average encoding time: ${totalTime / iterations} ms`);
}

async function testDecodingPerformance() {
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

    const encoded = bp.encode(randomString);

    const start = performance.now();
    const decoded = bp.decode(encoded.encodedString);
    const end = performance.now();
    console.log("  Decode: ", decoded.decodedString.length, "bytes");
    console.log("  Chunks: ", decoded.chunkCount, "chunks");
    totalTime += end - start;
    console.log("  Time: ", (end - start).toFixed(2), "ms\n")
  }

  console.log(`Average decoding time: ${totalTime / iterations} ms`);
}

(async () => {
  await testEncodingPerformance();
  await testDecodingPerformance();
})();