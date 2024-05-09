const { MUint8Encoder, UInt8E } = require("../muint8");

// ---
// @ Gen

// example
// const inp = "I am really Biiiiigigg number".repeat(100);
// Random string of random data ranging from 0000 to FFFF
function randomHexByte() {
  const arr = new Uint8Array(1);
  (crypto || window.crypto).getRandomValues(arr);
  return arr[0].toString(16).padStart(2, "0");
}

function makeRandomChar(...predef) {
  if (predef.length > 4) throw new Error("Too many predefined characters");
  let arr = new Array(4).concat(predef);
  const hexCode = arr.map(randomHexByte).join("");
  return String.fromCharCode(parseInt(hexCode, 16));
}

function makeSemiRandomCharset(length = 4, patternPercentage = 80) {
  // Do a random, with a given percentage to prefer the last one of 5 characters
  let cache = new Map();
  return Array.from({ length }, () => {
    let arr = new Array(length).fill(0);
    let i = Math.floor(Math.random() * length);
    let hexCode = randomHexByte();

    if (Math.random() * 100 < patternPercentage && cache.size > 0) {
      hexCode = Array.from(cache.keys())[Math.max(0, cache.size - 5)];
    } else {
      while (cache.has(hexCode)) hexCode = randomHexByte();
      cache.set(hexCode, i);

      if (cache.size > 5) cache.delete(cache.keys().next().value);
    }
    arr[i] = hexCode;
    return String.fromCharCode(parseInt(hexCode, 16));
  });
}

// ---
// @ Tests

function TestBasic() {
  const inp = new Array(10)
    .fill(null)
    .map((x) => makeRandomChar(255, 255))
    .join("");

  const encoder = new MUint8Encoder();

  const encoded = encoder.encode(inp, -1);
  const toString = UInt8E.decodeUint8(encoded);

  console.log("Input: ", UInt8E.encodeUint8(inp));
  console.log("OArr: ", encoder.mu.parseFromOverflowArr(encoded));
  console.log();

  console.log("Encoded: ", encoded);
  console.log(toString);
  console.log();

  const decoded = encoder.decode(encoded);
  console.log("Decoded: ", decoded);
  console.log(UInt8E.encodeUint8(decoded));

  var same = true,
    arrIn = UInt8E.encodeUint8(inp),
    arrDe = UInt8E.encodeUint8(decoded);

  for (let i = 0; i < inp.length; i++)
    if (arrIn[i] != arrDe[i]) {
      same = false;
      console.warn(`Mismatch at index ${i} (  ${inp[i]}  !=  ${decoded[i]}  )`);
      var charcodes = [inp.charCodeAt(i), decoded.charCodeAt(i)];
      console.warn(`Charcodes: ${charcodes}`);
      console.warn(
        `As Hex: ${charcodes.map((x) => x.toString(16).padStart(2, "0"))}`,
      );
    }

  console.log(same);

  console.log(
    "Opti: ",
    inp.length,
    encoded.length,
    inp.length - encoded.length,
  );

  return same;
}

function TestSemi() {
  const inp = new Array(10)
    .fill(null)
    .map((x) => makeSemiRandomCharset(4).join(''))
    .join("");

  const encoder = new MUint8Encoder();

  const encoded = encoder.encode(inp, -1);
  const toString = UInt8E.decodeUint8(encoded);

  console.log("Input: ", UInt8E.encodeUint8(inp));
  console.log("OArr: ", encoder.mu.parseFromOverflowArr(encoded));
  console.log();

  console.log("Encoded: ", encoded);
  console.log(toString);
  console.log();

  const decoded = encoder.decode(encoded);
  console.log("Decoded: ", decoded);
  console.log(UInt8E.encodeUint8(decoded));

  var same = true,
    arrIn = UInt8E.encodeUint8(inp),
    arrDe = UInt8E.encodeUint8(decoded);

  for (let i = 0; i < inp.length; i++) {
    if (arrIn[i] != arrDe[i]) {
      same = false;
      console.warn(`Mismatch at index ${i} (  ${inp[i]}  !=  ${decoded[i]}  )`);
      var charcodes = [inp.charCodeAt(i), decoded.charCodeAt(i)];
      console.warn(`Charcodes: ${charcodes}`);
      console.warn(
        `As Hex: ${charcodes.map((x) => x.toString(16).padStart(2, "0"))}`,
      );
    }
  }

  console.log(same);
  console.log(
    "Opti: ",
    inp.length,
    encoded.length,
    inp.length - encoded.length,
  );
  return same;
}

// ---

async function DoTests() {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const performTest = async (testFunc, iteration) => {
    await sleep(200);
    const result = testFunc();
    console.log(`Did test: ${result}`);
    if (!result) throw new Error(`Test failed at iteration ${iteration}`);
    console.log();
  };

  const doEveryFor = async (testFunc, iterations, interval) => {
    var jFn = testFunc[0] || testFunc,
      iFn = testFunc[1] || null;

    const retArr = [];
    for (let i = 0; i < iterations; i++) {
      for (let j = 0; j < interval; j++) retArr.push(await jFn(i, j));
      await iFn?.(i);
    }
    return retArr;
  };

  const doTestOn = async (fn, i, j) => {
    const tester = async (i, j) => {
        await performTest(fn, i);
        console.log(`Test ${i + 1} of ${j + 1}`);
        console.log();
        await sleep(100);
      },
      onComplete = async (i) => {
        console.log(
          `Completed ${fn.name || "anonymous"} iteration ${i + 1} of ${j + 1}`,
        );
        console.log();
        await sleep(100);
      };

    await doEveryFor([tester, onComplete], i, j);
  };

  const doTest = async (fn, i, j) => {
    const name = fn.name || "anonymous";
    let res;
    
    console.log(`Starting test ${name} iteration max ${i} of max ${j}`)
    res = await doTestOn(TestSemi, 5, 5);
    console.log(res)
    console.log(`Completed test ${name}`)
    
    return res;
  }

  await doTest(TestSemi, 5, 5);
  await doTest(TestBasic, 5, 5);

}

// ---
// @ Doing

DoTests();
