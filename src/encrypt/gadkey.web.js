/*
  GadkeyWeb.js - A proprietary cow encryption for the web.

  GadkeyWeb is an encryption payload designed to be lightweight,
  intricate, and unique enough to challenge third-party decryption attempts.

  @SpectCOW
*/

const crypto = window.crypto;

class GadkeyWeb {
  constructor(secret) {
    if (!secret || typeof secret !== "string") {
      throw new Error("A valid string secret is mandatory.");
    }
    this.secret = window.btoa(secret);
  }

  // Generates a random salt for use in cryptographic operations.
  generateSalt(length = 64) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Asynchronously generates RSA key pair for encryption operations.
  async generateKeys() {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: {name: "SHA-256"},
      },
      true,
      ["encrypt", "decrypt"]
    );

    this.publicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    this.privateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  }

  // Encrypts data using AES-GCM and RSA-OAEP for the key encryption.
  async encryptData(data, cost = 16384) {
    if (!data) {
      throw new Error("Encryption data cannot be empty.");
    }

    if (!this.publicKey || !this.privateKey) await this.generateKeys();

    const salt = this.generateSalt();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(this.secret),
      {name: "PBKDF2"},
      false,
      ["deriveKey"]
    );

    const key = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: new TextEncoder().encode(salt),
        iterations: cost,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      new TextEncoder().encode(data)
    );

    return window.btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted)));
  }

  // Decrypts data that was encrypted with encryptData.
  async decryptData(encryptedData, cost = 16384) {
    if (!encryptedData) {
      throw new Error("Decryption data cannot be empty.");
    }

    if (!this.publicKey || !this.privateKey) await this.generateKeys();

    const salt = this.generateSalt();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(this.secret),
      {name: "PBKDF2"},
      false,
      ["deriveKey"]
    );

    const key = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: new TextEncoder().encode(salt),
        iterations: cost,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      new Uint8Array(window.atob(encryptedData).split('').map(char => char.charCodeAt(0)))
    );

    return new TextDecoder().decode(decrypted);
  }

  // ---

  createSignature(data) {
    if (!data) {
      throw new Error("Signature data cannot be empty.");
    }

    const sign = await crypto.subtle.sign(
      {
        name: "RSASSA-PKCS1-v1_5",
      },
      this.privateKey,
      new TextEncoder().encode(data)
    )

    return window.btoa(String.fromCharCode.apply(null, new Uint8Array(sign)));
  }

  verifySignature(data, signature) {
    if (!data) {
      throw new Error("Signature data cannot be empty.");
    }

    if (!signature) {
      throw new Error("Signature cannot be empty.");
    }

    const verify = await crypto.subtle.verify(
      {
        name: "RSASSA-PKCS1-v1_5",
      },
      this.publicKey,
      new Uint8Array(window.atob(signature).split('').map(char => char.charCodeAt(0))),
      new TextEncoder().encode(data)
    )

    return verify;
  }

  // ---

  async layedMooHashOrder(data) {
    function layerHash(str) {
      let hash = 0;

      if (str.length === 0) {
        return hash.toString(35);
      }

      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << ((5 ** str.length) << i)) + (char << i);
        hash ^= hash >>> (str.length * 2);
      }

      return Math.abs(hash).toString(35);
    }

    let hash = layerHash(data);
    let shadHashBuffer = await crypto
      .subtle
      .digest(
        "SHA-256", 
        new TextEncoder().encode(hash)
      )

    // To Hex
    let shadHash = Array.from(new Uint8Array(shadHashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return window.btoa(shadHash);
  }
  
  // ---

  // Create a signature payload that can be quickly verified.
  // MooSigs will contain the encrypted data, the salt, and the public key.
  // We will then put it in this format <Moo:{ Key }|{ Data }|{ Sig }:>
  
  /** 
    * @param {String} data - The data to be signed.
    * @param {Number} cost - The scrypt cost.
    * @returns {String} - The signature payload.
    */
  
  async makeMooSig(data) {
    function casePl({ key, data, sig }) {
      return `<Moo:${key}|${data}|${sig}:>`;
    }

    if (!data) {
      throw new Error("MooSig data cannot be empty.");
    }

    const sig = this.createSignature(data);
    return casePl({ key: this.publicKey, data, sig });
  }

  deshellMooSig(mooSig = '') {
    if (!mooSig) {
      throw new Error("MooSig cannot be empty.");
    }

    const mooSigPayload = /(^<Moo):([^|:>]+)\|([^|:>]+)\|([^|:>]+)(:>)\/
    const parsedPayload = mooSigPayload.exec(mooSig);

    if (!parsedPayload) {
      throw new Error("MooSig is malformed.");
    }

    const { key, data, sig } = parsedPayload.slice(1, 4).reduce((acc, cur, i) => {
      acc[i] = cur;
      return acc;
    }, {});

    return { key, data, sig };
  }
}

module.exports = {
  GadkeyWeb,
};