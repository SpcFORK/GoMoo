// Data to Uint8 Encoder
// Copyright (C) 2024  SpectCOW

const encoder = new TextEncoder(),
  decoder = new TextDecoder("utf-8", { ignoreBOM: true }),
  encodeUint8 = (input = "") => encoder.encode(input),
  decodeUint8 = (input = new Uint8Array()) => decoder.decode(input)

module.exports = {
  encodeUint8,
  decodeUint8
};
