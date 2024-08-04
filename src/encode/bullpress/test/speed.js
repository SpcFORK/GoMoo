const { GoMooE1 } = require("../index");
const bp = GoMooE1;

function generateRandomString(length, kind = "hard") {
  let s = "";
  function addCharCode(maxNum) {
    return (s += String.fromCharCode(Math.floor(Math.random() * maxNum)));
  }

  function run() {
    switch (kind) {
      case 0:
      case "instant":
        return addCharCode(0xf);
      case 1:
      case "simple":
        return addCharCode(0x9f);
      case 2:
      case "hard":
        return addCharCode(0xfff);
      case 3:
      case "veryHard":
        return addCharCode(0xffff);
      case 4:
      case "extreme":
        return addCharCode(0xffffff);
      case 5:
      case "unicode":
        return addCharCode(65535 - 12000);
    }
  }

  for (let i = 0; i < length; i++) run();

  return s;
}

function makeOddString(length, entropy = 100) {
  let arr = [];
  let l = Math.floor(length / entropy);
  for (let i = 0; i < length; i += l)
    arr.push(generateRandomString(l, Math.floor(Math.random() * 5)));
  return arr.join("");
}

async function testEncodingPerformance() {
  const iterations = 10;
  let totalTime = 0;

  let timings = [];

  let stringArr = [];
  for (let i = 0; i < iterations; i++)
    stringArr.push(makeOddString(bp.CHUNK_LENGTH, i + 1));

  stringArr.map((s, i) => {
    console.log("Iteration: ", i + 1, "of", iterations, "\n ", totalTime);
    console.log(
      "  String Len: ",
      s.length,
      ", \n  String Slice:",
      s.slice(0, 10),
      "...\n",
    );

    const start = performance.now();
    try {
      var encoded = bp.encode(s);
    } catch (e) {
      return console.log(e);
    }
    console.log("  Encode: ", encoded.encodedString.length, "bytes");
    const end = performance.now();

    const time = end - start;
    // @@ Cost Constant
    let avg = (time / s.length)
    timings.push(avg);
    console.log('  Cst: ', avg)

    console.log("  PL: ", encoded.presumedTime, "ms");
    totalTime += time;
    console.log("  Time: ", time.toFixed(2), "ms\n");
    console.log("  E Slice:", encoded.encodedString.slice(0, 2000), "...\n");
  });

  console.log(`Average encoding time: ${totalTime / iterations} ms`);

  // @@ Cost Constant
  const averageCostConstant =
    timings.reduce((acc, curr) => acc + curr, 0) / timings.length;
  console.log(`Average cost constant: ${averageCostConstant.toFixed(2)} ms`);
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
      "...\n",
    );

    const encoded = bp.encode(randomString);

    console.log(
      "  Encode finished, starting decode of ",
      encoded.encodedString.length,
      " bytes",
      "\n",
    );

    const start = performance.now();
    const decoded = bp.decode(encoded.encodedString);
    const end = performance.now();
    console.log("  Decode: ", decoded.decodedString.length, "bytes");
    console.log("  Chunks: ", decoded.chunkCount, "chunks");
    totalTime += end - start;
    console.log("  Time: ", (end - start).toFixed(2), "ms\n");
  }

  console.log(`Average decoding time: ${totalTime / iterations} ms`);
}

(async () => {
  await testEncodingPerformance();
  await testDecodingPerformance();
})();
