import fs from "fs";
import { createHash } from "crypto";

const calculateHash = async () => {
  const filePath = new URL(
    "./files/fileToCalculateHashFor.txt",
    import.meta.url
  );
  const hash = createHash("sha256");

  try {
    const stream = fs.createReadStream(filePath);
    for await (const chunk of stream) {
      hash.update(chunk);
    }

    console.log(hash.digest("hex"));
  } catch {
    throw new Error("FS operation failed");
  }
};

await calculateHash();
