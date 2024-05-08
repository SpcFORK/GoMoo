// An account service for cows.
// Copyright (C) 2024  SpectCOW

/** 
  * BWT - Burrows-Wheeler Transform
  */

function burrowsWheelerTransform(input) {
  const rotations = [];

  // Generate rotations of the input string
  for (let i = 0; i < input.length; i++) {
    const rotation = input.slice(i) + input.slice(0, i);
    rotations.push(rotation);
  }

  // Sort rotations lexicographically
  rotations.sort();

  // Extract the last characters of each rotation to form the transformed string
  let transformedString = "";
  for (let i = 0; i < rotations.length; i++) {
    transformedString += rotations[i][input.length - 1];
  }

  // Find the original string's index in the sorted rotations
  let originalIndex;
  for (let i = 0; i < rotations.length; i++) {
    if (rotations[i] === input) {
      originalIndex = i;
      break;
    }
  }

  return { transformedString, originalIndex };
}

function inverseBurrowsWheelerTransform(transformedString = '', originalIndex) {
  const table = [];

  // Construct the Burrows-Wheeler transformation table
  for (let i = 0; i < transformedString.length; i++) {
    table.push({ char: transformedString[i], index: i });
  }

  // Sort the table lexicographically
  table.sort((a, b) => {
    if (a.char < b.char) return -1;
    if (a.char > b.char) return 1;
    return 0;
  });

  // Reconstruct the original string using the first column of the sorted table and originalIndex
  let originalString = "";
  let currentIndex = originalIndex;
  for (let i = 0; i < transformedString.length; i++) {
    originalString += table[currentIndex].char;
    currentIndex = table[currentIndex].index;
  }

  return originalString;
}

// Example usage
// const inputString = "banana";
// const { transformedString, originalIndex } =
//   burrowsWheelerTransform(inputString);
// console.log("Transformed string:", transformedString);
// console.log("Original index:", originalIndex);
// console.log(
//   "Original string:",
//   inverseBurrowsWheelerTransform(transformedString, originalIndex),
// );

const eobj = {
  burrowsWheelerTransform,
  inverseBurrowsWheelerTransform,
};

if (typeof globalThis.window !== "undefined") globalThis.window.bwt = eobj;
if (typeof module !== "undefined") module.exports = eobj;