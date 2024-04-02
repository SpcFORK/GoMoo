const {
  encodeBullpress,
  decodeBullpress,
  CHUNK_LENGTH,
  calculateCost,
} = require("./src/encode/bullpress.js");

const fs = require("fs");
const path = require("path");

function processEncoding(input, logging = false) {
  const start = Date.now();
  const originalString = encodeURI(input);

  function logIfEnabled(...messages) {
    if (logging) console.log(...messages);
  }

  {
    logIfEnabled("Original String: ", input);
    logIfEnabled(".");
    logIfEnabled("Original String (With URI ENCODE): ", originalString);
    logIfEnabled("..");
    logIfEnabled();
  }

  const presumedTime = calculateCost(input).toFixed(2);

  {
    logIfEnabled(
      "Original Length:    ",
      originalString.length,
      "bytes (",
      (originalString.length / 1024 / 1024).toFixed(2),
      "MB )",
    );
    logIfEnabled("Chunk Length: ", CHUNK_LENGTH, "bytes");
    logIfEnabled("Number of Chunks: ", Math.floor(input.length / CHUNK_LENGTH));
    logIfEnabled("Presumed time: ", presumedTime, "ms");
  }

  const encodedString = encodeBullpress(originalString);

  {
    logIfEnabled();
    logIfEnabled(
      "Encoded String: ",
      encodedString.slice(0, Math.min(10000, encodedString.length)),
      "\n",
    );

    logIfEnabled(
      "Optimization Status: ",
      encodedString.length < originalString.length
        ? "Optimized"
        : "Not Optimized",
    );

    logIfEnabled(
      "Encoded Length:  ",
      encodedString.length,
      "bytes (",
      (encodedString.length / 1024 / 1024).toFixed(2),
      "MB )",
    );

    logIfEnabled(
      "Size Difference:  ",
      encodedString.length - originalString.length,
      "bytes",
    );
    logIfEnabled(
      "Percentage Difference:  ",
      (
        ((encodedString.length - originalString.length) /
          originalString.length) *
        100
      ).toFixed(2),
      "%",
    );
    logIfEnabled();
  }

  const end = Date.now();
  const guessAccuracy = end - start - presumedTime;

  const decodedString = decodeBullpress(encodedString);
  const end2 = Date.now();

  {
    logIfEnabled("Processing Time: ", end - start, "ms");
    logIfEnabled("Presumtion Accuracy: ", guessAccuracy.toFixed(2), "ms");

    logIfEnabled("Decoding time: ", end2 - end, "ms");
    logIfEnabled();

    logIfEnabled("Result: ", originalString === decodedString);
  }

  return {
    originalString,
    encodedString,
    decodedString,
    presumedTime,
    guessAccuracy,
  };
}
