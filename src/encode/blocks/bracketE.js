const eobj = {
  encode(input) {
    return (
      input
        .replace(/\]\(/g, "Ϣ")
        .replace(/\)\[/g, "ϣ")

        .replace(/\]\{/g, "Ϡ")
        .replace(/\}\[/g, "ϡ")

        .replace(/\)\{/g, "Ϟ")
        .replace(/\}\(/g, "ϟ")

        // SIMPLE (Must be below, for some reason)

        .replace(/\(\[/g, "{")
        .replace(/\]\)/g, "}")

        .replace(/\[\(/g, "<")
        .replace(/\)\]/g, ">")
    );
  },

  decode(input) {
    return (
      input

        .replace(/Ϣ/g, "](")
        .replace(/ϣ/g, ")[")

        .replace(/Ϡ/g, "]{")
        .replace(/ϡ/g, "}[")

        .replace(/Ϟ/g, "){")
        .replace(/ϟ/g, "}(")

        // SIMPLE (Must be below, for some reason)

        .replace(/\{/g, "([")
        .replace(/\}/g, "])")

        .replace(/\</g, "[(")
        .replace(/\>/g, ")]")
    );
  },
};

if (typeof globalThis.window !== "undefined")
  globalThis.window.BracketEncoder = eobj;
if (typeof module !== "undefined") module.exports = eobj;
