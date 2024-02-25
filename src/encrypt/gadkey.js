/*
  Gadkey.js - A proprietary cow encryption.

  Gadkey is an encryption payload designed to be small,
  elaborate, and unique to an extent, as to make it difficult for 3rd-parties to decode.

  @SpectCOW
*/

const crypto = require("crypto");
const util = require("util");

class Gadkey {
  constructor(secret) {
    if (!secret || typeof secret !== "string") {
      throw new Error("A valid string secret is mandatory.");
    }
    this.secret = Buffer.from(secret, "utf-8").toString("base64");
  }

  // Generates a random salt for use in cryptographic operations.
  generateSalt(length = 64) {
    return crypto.randomBytes(length).toString("hex");
  }

  // Asynchronously generates RSA key pair for encryption operations.
  async generateKeys() {
    const generateKeyPair = util.promisify(crypto.generateKeyPair);

    const { publicKey, privateKey } = await generateKeyPair("rsa", {
      modulusLength: 2048, // Uses a 2048-bit key for decent security.
    });

    this.publicKey = publicKey.export({
      type: "spki",
      format: "pem",
    });

    this.privateKey = privateKey.export({
      type: "pkcs8",
      format: "pem",
      cipher: "aes-256-cbc", // Uses AES-256 for encrypting the private key itself.
      passphrase: this.secret,
    });
  }

  // Encrypts data using AES-256-GCM and RSA for the key encryption.
  async encryptData(data, cost = 16384) {
    if (!data) {
      throw new Error("Encryption data cannot be empty.");
    }

    if (!this.publicKey || !this.privateKey) await this.generateKeys();

    const salt = this.generateSalt();
    const scryptAsync = util.promisify(crypto.scrypt);
    const key = await scryptAsync(this.secret, salt, 32, { cost });
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
    let encrypted = cipher.update(data, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag().toString("hex");

    let obj = {
      salt,
      iv: iv.toString("hex"),
      authTag,
      encrypted,
    };

    const encryptedJSON = crypto.publicEncrypt(
      {
        key: this.publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(JSON.stringify(obj)),
    );

    return encryptedJSON.toString("base64");
  }

  // Decrypts data that was encrypted with encryptData.
  async decryptData(encryptedJSON, cost = 16384) {
    if (!encryptedJSON) {
      throw new Error("Decryption data cannot be empty.");
    }

    const payloadJSON = crypto.privateDecrypt(
      {
        key: this.privateKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256",
      },
      Buffer.from(encryptedJSON, "base64"),
    );

    const payload = JSON.parse(payloadJSON.toString("utf8"));

    const scryptAsync = util.promisify(crypto.scrypt);
    const key = await scryptAsync(this.secret, payload.salt, 32, { cost });

    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(payload.iv, "hex"),
    );
    decipher.setAuthTag(Buffer.from(payload.authTag, "hex"));

    let decrypted = decipher.update(payload.encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  }

  // ---

  createSignature(data) {
    if (!data) {
      throw new Error("Signature data cannot be empty.");
    }

    const sign = crypto.createSign("RSA-SHA256");
    sign.update(data);
    return sign.sign(this.privateKey, "base64");
  }

  verifySignature(data, signature) {
    if (!data) {
      throw new Error("Signature data cannot be empty.");
    }

    if (!signature) {
      throw new Error("Signature cannot be empty.");
    }

    const verify = crypto.createVerify("RSA-SHA256");
    verify.update(data);
    return verify.verify(this.publicKey, signature, "base64");
  }

  // ---

  layedMooHashOrder(data) {
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
    let shadHash = crypto
      .createHash("sha256")
      .update(hash)
      .digest("hex")
      .toString("base64");

    return shadHash;
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

    const mooSigPayload = /(^<Moo):([^|:>]+)\|([^|:>]+)\|([^|:>]+)(:>)/
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
  Gadkey,
};
