import fs from "fs";
import { createGzip } from "zlib";
import { pipeline } from "stream/promises";

const compress = async () => {
  const srcPath = new URL("./files/fileToCompress.txt", import.meta.url);
  const dstPath = new URL("./files/archive.gz", import.meta.url);

  try {
    await pipeline(
      fs.createReadStream(srcPath),
      createGzip(),
      fs.createWriteStream(dstPath)
    );
  } catch {
    throw new Error("FS operation failed");
  }
};

await compress();
