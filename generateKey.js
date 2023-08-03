import crypto from "crypto";

export default class GenerateKey {
  constructor(keyLength, algorithm = "sha3-256") {
    if (keyLength < 256) {
      throw new Error("The key length should be at least 256 bits.");
    }

    this.keyLength = keyLength;
    this.algorithm = algorithm;
  }

  generateRandomKey() {
    const byteLength = Math.ceil(this.keyLength / 8);
    const buffer = crypto.randomBytes(byteLength);
    return buffer.toString("hex");
  }

  calculateHMAC(message, key) {
    const hmac = crypto.createHmac(this.algorithm, key);
    hmac.update(message);
    const hmacHex = hmac.digest("hex");
    return hmacHex;
  }
}
