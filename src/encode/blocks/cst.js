const CHUNK_LENGTH = 1024 * 8;
const CHUCK_LENGTH_SPEED = 270;
const CHAR_EXCHANGE_COST = CHUCK_LENGTH_SPEED / CHUNK_LENGTH;

function calculateCost(string) {
  return string.length * CHAR_EXCHANGE_COST;
}

function calculateChunks(string) {
  return Math.ceil(string.length / CHUNK_LENGTH);
}

const eobj = {
  CHUNK_LENGTH,
  CHUCK_LENGTH_SPEED,
  CHAR_EXCHANGE_COST,
  
  calculateCost,
  calculateChunks,
};

if (typeof globalThis.window !== "undefined") globalThis.window.cst = eobj;
if (typeof module !== "undefined") module.exports = eobj;