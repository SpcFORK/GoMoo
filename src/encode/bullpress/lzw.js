// Compress the string
function lzwCompress(input) {
  let dictionary = {},
    inputArray = input.split(""),
    output = [],
    currentChar = inputArray[0],
    dictSize = 256;
  for (let i = 1; i < inputArray.length; i++) {
    let nextChar = inputArray[i],
      ind = currentChar + nextChar,
      dictRes = dictionary[ind],
      _char = dictionary[currentChar];
    if (dictRes != null) currentChar += nextChar;
    else {
      output.push(currentChar.length > 1 ? _char : currentChar.charCodeAt(0));
      dictionary[ind] = dictSize;
      dictSize++;
      currentChar = nextChar;
    }
  }
  output.push(currentChar.length > 1 ? _char : currentChar.charCodeAt(0));
  for (let i = 0; i < output.length; i++)
    output[i] = String.fromCharCode(output[i]);
  return output.join("");
}

// Decompress the compressed string
function lzwDeompress(compressed) {
  let dictionary = {},
    compressedArray = compressed.split(""),
    _char = compressedArray[0],
    currentChar = _char,
    previousChar = _char,
    result = [currentChar],
    dictSize = 256,
    code = 256;
  for (let i = 1; i < compressedArray.length; i++) {
    let char = compressedArray[i],
      currentCode = char.charCodeAt(0),
      entry =
        dictSize > currentCode
          ? char
          : dictionary[currentCode] || previousChar + currentChar;
    result.push(entry);
    currentChar = entry.charAt(0);
    dictionary[code] = previousChar + currentChar;
    code++;
    previousChar = entry;
  }
  return result.join("");
}

const eobj = {
  lzwCompress,
  lzwDeompress,
}

if (typeof module !== "undefined") module.exports = eobj;
if (typeof window !== "undefined") window.lzw = eobj;