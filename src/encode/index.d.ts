export as namespace bullpress;

export interface Bullpress {
  encode(input: string): string;
  encodeP(input: string, logging?: boolean): Promise<string>;
  decode(input: string): string;
  decodeP(input: string, logging?: boolean): Promise<string>;
  Test(input: string, logging?: boolean): any;

  // @ Other exports
  CHUNK_LENGTH: number;
  calculateCost(input: string): number;
  calculateChunks(input: string): number;

  base64(input: string): string;
  Cowrle(input: string): string;
  BWT(input: string): string;
  // Unused
  Huffman(input: string): string;

  BP: any;

  decodeBPUInt8(encoded: Uint8Array): string | Uint8Array;
}

export interface MUint8 {
  /**
   * Encodes input into a Uint8Array with optional chunk size.
   * @param input The input to encode, either a string or Uint8Array.
   * @param chunkSize The optional chunk size for encoding; defaults to the full input length if not specified.
   * @returns Encoded Uint8Array.
   */
  encode(input: string | Uint8Array, chunkSize?: number): Uint8Array;

  /**
   * Decodes the encoded Uint8Array back into a string or Uint8Array.
   * @param encoded The Uint8Array to decode.
   * @returns Decoded string or Uint8Array.
   */
  decode(encoded: Uint8Array): string | Uint8Array;

  /**
   * Adds a new enum symbol with its corresponding value to the encoder.
   * @param symbol The symbol to add as an enum.
   * @param value The value associated with the symbol.
   */
  addEnum(symbol: string, value: number): void;

  /**
   * Retrieves the value associated with a given enum symbol.
   * @param symbol The symbol whose value is to be retrieved.
   * @returns The value associated with the symbol, or undefined if not found.
   */
  getEnum(symbol: string): number | undefined;
}

export interface MUint8Encoder {
  encode(input: string | Uint8Array, chunkSize?: number): Uint8Array;
  decode(encoded: Uint8Array): string | Uint8Array;
}

export interface UInt8E {
  encodeUint8(input: string | Uint8Array): Uint8Array;
  decodeUint8(encoded: Uint8Array): string | Uint8Array;
}

export interface FlagArrayRLE {
  encode(input: Uint8Array): Uint8Array;
  decode(encoded: Uint8Array): Uint8Array;
}

export var bullpress: Bullpress;
export var muint8: {
  MUint8: MUint8;
  MUint8Encoder: MUint8Encoder;
  UInt8E: UInt8E;
  FlagArrayRLE: FlagArrayRLE;
};