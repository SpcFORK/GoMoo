const eobj = {
  // BP1
  
  caseChunk({ transformedString, originalIndex }) {
    return `<Bull_Chunk:${transformedString}|${originalIndex}:>`;
  },

  caseBull({ chunk }) {
    return `<Bull:${chunk}:>`;
  },

  // BP2
  caseChunk2({ transformedString, originalIndex, map, mapI }) {
    return `<Bull2_Chunk:${transformedString}|${originalIndex}|${map}|${mapI}:>`;
  },

  caseBull2({ chunk }) {
    return `<Bull2:${chunk}:>`;
  },
};

if (typeof globalThis.window !== "undefined") globalThis.window.casing = eobj;
if (typeof module !== "undefined") module.exports = eobj;