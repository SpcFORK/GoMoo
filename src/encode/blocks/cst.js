const CHUNK_LENGTH = 1024 * 8;

// Manually must adjust when changes to API are made
// Who knows how many MS
// Run speed.js to find out
const CHUCK_LENGTH_SPEED = 4500

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

if (typeof window !== "undefined") window.cst = eobj;
if (typeof module !== "undefined") module.exports = eobj;