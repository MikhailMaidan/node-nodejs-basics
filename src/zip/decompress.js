import fs from "fs";
import { createGunzip } from "zlib";
import { pipeline } from "stream/promises";

const decompress = async () => {
  const srcPath = new URL("./files/archive.gz", import.meta.url);
  const dstPath = new URL("./files/fileToCompress1.txt", import.meta.url);

  try {
    await pipeline(
      fs.createReadStream(srcPath),
      createGunzip(),
      fs.createWriteStream(dstPath)
    );
  } catch {
    throw new Error("FS operation failed");
  }
};

await decompress();
