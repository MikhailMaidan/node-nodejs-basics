import fs from "fs";

const write = async () => {
  const filePath = new URL("./files/fileToWrite.txt", import.meta.url);

  const outStream = fs.createWriteStream(filePath);

  await new Promise((resolve, reject) => {
    process.stdin.once("error", () => reject(new Error("FS operation failed")));
    outStream.once("error", () => reject(new Error("FS operation failed")));

    outStream.once("finish", resolve);

    process.stdin.pipe(outStream);
  });
};

await write();
