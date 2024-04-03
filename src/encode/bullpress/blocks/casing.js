const eobj = {
  // Format: <BWT:{ transformedString }|{ originalIndex }:>
  caseChunk({ transformedString, originalIndex }) {
    return `<Bull_Chunk:${transformedString}|${originalIndex}:>`;
  },

  caseBull({ chunk }) {
    return `<Bull:${chunk}:>`;
  },
};

if (typeof globalThis.window !== "undefined") globalThis.window.casing = eobj;
if (typeof module !== "undefined") module.exports = eobj;