const crypto = require("crypto");
const algorithm = "aes-256-ctr";
// const key = crypto.randomBytes(32);
// const key = "10f167139494183722bb55488d4f097b";
const key = process.env.SECRETE_KEY;
const iv = crypto.randomBytes(16);

// encryption function

const encrypt = (plainText) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText), cipher.final()]);

  return {
    iv: iv.toString("hex"),
    content: encrypted.toString("hex"),
  };
};

//decrypt function

const decrypt = (encryptedData) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(encryptedData.iv, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedData.content, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString();
};

module.exports = { encrypt, decrypt };
