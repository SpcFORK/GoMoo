const BP = require("./bullpress.js"),
  {
    encodeBullpress,
    decodeBullpress,
    CHUNK_LENGTH,

    base64,
    Cowrle,
    BWT,
    // Unused
    Huffman,

    calculateCost,
    calculateChunks,
  } = BP;

// ---

function encode(input, logging = false) {
  const start = Date.now(),
    uriString = input;

  function logIfEnabled(...messages) {
    if (logging) console.log(...messages);
  }

  {
    logIfEnabled("Encode COST:    ", calculateCost(uriString));
  }

  if (input.length < 1000) {
    logIfEnabled("Original String:   ", input);
    logIfEnabled(".");
    logIfEnabled("Original String (With URI ENCODE):   ", uriString);
    logIfEnabled("..");
    logIfEnabled();
  }

  const encodedString = encodeBullpress(uriString),
    isOptimized = encodedString.length < uriString.length,
    chunkCount = calculateChunks(uriString);

  {
    logIfEnabled(
      "Encoded String:   ",
      encodedString < 1000
        ? encodedString
        : encodedString.slice(0, 1000) + "...",
      "\n",
    );

    logIfEnabled(
      "Optimization Status:   ",
      isOptimized ? "Optimized" : "Not Optimized",
      "\n",
    );

    logIfEnabled(
      "Encoded Length:   ",
      encodedString.length,
      "bytes (",
      (encodedString.length / 1024 / 1024).toFixed(2),
      "MB )",
    );

    logIfEnabled("Chunk Count:   ", chunkCount);
  }

  const end = Date.now(),
    timeSpent = end - start;

  {
    logIfEnabled("Processing Time:   ", timeSpent, "ms\n");
  }

  return {
    uriString,
    encodedString,
    isOptimized,
    endTime: end,
    startTime: start,
    timeSpent,
    chunkCount,
    presumedTime: calculateCost(uriString).toFixed(2),
    asUInt8: () => BP.Uint8Encoder.encodeUint8(encodedString),
  };
}

function encodeP(input, logging = false) {
  return new Promise((resolve, reject) => resolve(encode(input, logging)));
}

// ---

function decode(input, logging = false) {
  function logIfEnabled(...messages) {
    if (logging) console.log(...messages);
  }

  const start = Date.now(),
    decodedString = decodeBullpress(input),
    chunkCount = calculateChunks(decodedString);

  {
    logIfEnabled(
      "Decoded String:   ",
      decodedString < 1000
        ? decodedString
        : decodedString.slice(0, 1000) + "...",
      "\n",
    );

    logIfEnabled(
      "Decoded Length:   ",
      decodedString.length,
      "bytes (",
      (decodedString.length / 1024 / 1024).toFixed(2),
      "MB )",
    );

    logIfEnabled("Chunk Count:   ", chunkCount);
  }

  const end = Date.now(),
    timeSpent = end - start;

  {
    logIfEnabled("Processing Time:   ", timeSpent, "ms\n");
  }

  return {
    decodedString: decodedString,
    endTime: end,
    startTime: start,
    timeSpent,
    chunkCount,
  };
}

function decodeP(input, logging = false) {
  return new Promise((resolve, reject) => resolve(decode(input, logging)));
}

// ---

function processEncoding(input, logging = false) {
  // Logging if enabled
  function logIfEnabled(...messages) {
    if (logging) console.log(...messages);
  }

  logIfEnabled(".-- Encoding... --.\n");

  const // Encoding the input
    encodeResult = encode(input, logging),
    {
      uriString,
      isOptimized,
      encodedString,
      endTime: encodeEndTime,
      startTime: encodeStartTime,
      timeSpent: encodeTimeSpent,
      chunkCount: encodeChunkCount,
      presumedTime,
    } = encodeResult;

  logIfEnabled("'---- Encoded ----'\n");
  logIfEnabled(".-- Decoding... --.\n");

  const // Decoding the encoded string
    decodeResult = decode(encodedString, logging),
    {
      decodedString,
      endTime: decodeEndTime,
      startTime: decodeStartTime,
      timeSpent: decodeTimeSpent,
      chunkCount: decodeChunkCount,
    } = decodeResult;

  logIfEnabled("'---- Decoded ----'\n");

  logIfEnabled(".-- Doing Math... --.\n");

  const // Calculating the time difference
    timeDifference = decodeEndTime - encodeStartTime - presumedTime,
    // Calculating the size difference
    ELEN = encodedString.length,
    OLEN = uriString.length,
    SLEN = decodedString.length,
    SDIFF = ELEN - OLEN,
    PDIFF = ((SLEN - ELEN) / ELEN) * 100,
    sizeDifference = SLEN - ELEN,
    sizeDifferencePerc = (((ELEN - OLEN) / OLEN) * 100).toFixed(2),
    RESULT = uriString === decodedString;

  logIfEnabled("'-------------------'\n");
  // ---

  logIfEnabled(".-- Doing Logs... --.\n");
  {
    logIfEnabled(
      "Original Length:   ",
      uriString.length,
      "bytes (",
      (uriString.length / 1024 / 1024).toFixed(2),
      "MB )",
    );

    logIfEnabled();
    logIfEnabled("Chunk Length:   ", CHUNK_LENGTH, "bytes");
    logIfEnabled(
      "Number of Chunks (Encoding):   ",
      encodeChunkCount, // Displaying chunk count for encoding
    );
    logIfEnabled(
      "Number of Chunks (Decoding):   ",
      decodeChunkCount, // Displaying chunk count for decoding
    );

    logIfEnabled();
    logIfEnabled("Encoding time:   ", encodeTimeSpent, "ms");
    logIfEnabled("Decoding time:   ", decodeEndTime - decodeStartTime, "ms");
    logIfEnabled("Presumed time:   ", presumedTime, "ms");

    logIfEnabled();
    logIfEnabled("Sizing difference:   ", sizeDifference, "bytes");
    logIfEnabled("Size difference %:   ", sizeDifferencePerc, "%");

    logIfEnabled();
    logIfEnabled(
      "Encoding Optimization:   ",
      isOptimized ? "Optimized" : "Not Optimized",
    );

    logIfEnabled();
    logIfEnabled("PDIFF:   ", PDIFF, "%");

    logIfEnabled();
    logIfEnabled(
      "Total Processing Time:   ",
      encodeEndTime - encodeStartTime + decodeEndTime - decodeStartTime,
      "ms",
    );

    logIfEnabled();
    logIfEnabled("Presumption Accuracy:   ", timeDifference.toFixed(2), "ms");

    logIfEnabled();
    logIfEnabled("Result:   ", RESULT ? "Success" : "Failure");

    logIfEnabled();
  }
  logIfEnabled("'-- Done logging! --'\n");

  return {
    decodedString: () => decodedString,
    decodeEndTime,
    decodeStartTime,
    decodeTimeSpent,

    encodedString: () => encodedString,
    encodeEndTime,
    encodeStartTime,
    encodeTimeSpent,

    isOptimized,
    presumedTime,
    result: RESULT,

    sizeDifference,
    sizeDifferencePerc,
    timeDifference,

    uriString: () => uriString,
  };
}

// ---

const eobj = {
  encode,
  encodeP,
  decode,
  decodeP,
  Test: processEncoding,

  // @ Other exports
  CHUNK_LENGTH,
  calculateCost,
  calculateChunks,

  base64,
  Cowrle,
  BWT,
  // Unused
  Huffman,

  BP,

  decodeBPUInt8: BP.decompressFromUInt8Buffer,
};

if (typeof globalThis.window !== "undefined") globalThis.window.GoMooE1 = eobj;
if (typeof module !== "undefined") module.exports = eobj;
