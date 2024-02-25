// An account service for cows.
// Copyright (C) 2024  SpectCOW

/*
 * COWRLE - Compact Oversimplified Wonderful RLE
 * Copyright (C) 2024  SpectCOW
 */

function* encodeCOWRLEGenerator(input) {
  let encoded = "",
    lastCount = (i = 0),
    count = 1,
    inBrackets = !1,
    processChar = (char, nextChar) => {
      if (char === nextChar) {
        count++;
      } else {
        handleUniqueChar(char);
      }
    },
    handleUniqueChar = (char) => {
      if (count > 1) {
        handleRepeatedChar(char);
      } else {
        handleSingleChar(char);
      }

      finalizeEncoding();
    },
    handleRepeatedChar = (char) => {
      if (!inBrackets) {
        encoded += "[";
        inBrackets = !0;
      }

      if (lastCount != count) {
        encoded += count;
        lastCount = count;
      }

      encoded += char;
    },
    handleSingleChar = (char) => {
      if (inBrackets) {
        encoded += "]";
        inBrackets = !1;
      }

      encoded += char;
    },
    finalizeEncoding = () => {
      if (i == input.length - 1 && inBrackets) {
        encoded += "]";
      }

      count = 1;
    };

  {
    try {
      for (; i < input.length; i++) {
        processChar(input[i], input[i + 1]);
        yield encoded;
        encoded = "";
      }
    } catch (e) {
      console.error("Failed to encode COWRLE:", e);
    } finally {
      // Cleanup Memory for Return
      encoded = null;
    }
  }
}

function* decodeCOWRLEGenerator(input) {
  let decoded = "",
    count = "",
    inBrackets = !1,
    lastCount = 1,
    i = 0,
    processCharacter = (character) => {
      if (character === "[") {
        inBrackets = true;
        return;
      }

      if (character === "]") {
        inBrackets = false;
        return;
      }

      if (character !== " " && !isNaN(character)) {
        updateCount(character);
      } else {
        handleCharacter(character);
      }
    },
    updateCount = (character) => {
      count += character;
      lastCount = parseInt(count);
    },
    handleCharacter = (character) => {
      if (parseInt(count) !== 0 && parseInt(count) !== lastCount) {
        decoded += character.repeat(lastCount);
      } else if (parseInt(count) == lastCount) {
        decoded += character.repeat(parseInt(count));
        count = "0";
      } else {
        if (inBrackets)
          decoded += character.repeat(parseInt(count) || lastCount);
        else decoded += character;
      }
    };

  try {
    for (; i < input.length; i++) {
      processCharacter(input[i]);
      yield decoded;
      decoded = "";
    }
  } catch (e) {
    console.error("Failed to decode COWRLE:", e);
  } finally {
    // Cleanup Memory for Return
    decoded = null;
  }
}

function encodeCOWRLE(input) {
  return [...encodeCOWRLEGenerator(input)].join("");
}

function decodeCOWRLE(input) {
  return [...decodeCOWRLEGenerator(input)].join("");
}

// Example usage:
// const originalString = "I am a SUUUUUUUUUUUUUUUUPERRRRRRRRR big fiiiillleeeee";
// console.log("Origini String: ", originalString);

// const encodedString = encodeCOWRLE(originalString);
// console.log("Encoded String: ", encodedString);

// const decodedString = decodeCOWRLE(encodedString);
// console.log("Decoded String: ", decodedString);

// console.log("Result: ", (originalString === decodedString))

const eobj = {
  encodeCOWRLE,
  decodeCOWRLE,
};

if (typeof globalThis.window !== "undefined") {
  globalThis.window.BWT = eobj;
} else module.exports = eobj;
