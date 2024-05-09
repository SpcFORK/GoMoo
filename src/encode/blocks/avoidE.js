const eobj = {
  encode(input) {
    // Escape any Special Characters
    const caser = (_) => `(${_})`;
    return input.replace(/\d+/g, (match) =>
      caser(
        match
          .split("")
          .map((digit) =>
            String.fromCharCode("A".charCodeAt(0) + parseInt(digit)),
          )
          .join(""),
      ),
    );
  },

  decode(input) {
    return input.replace(/\((.*?)\)/g, (match, p1) =>
      p1
        .split("")
        .map((char) => char.charCodeAt(0) - "A".charCodeAt(0))
        .join(""),
    );
  },
};

if (typeof globalThis.window !== "undefined") globalThis.window.AvoidEnc = eobj;
if (typeof module !== "undefined") module.exports = eobj;
