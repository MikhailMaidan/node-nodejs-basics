import fs from "fs";

const read = async () => {
  const filePath = new URL("./files/fileToRead.txt", import.meta.url);

  const stream = fs.createReadStream(filePath, { encoding: "utf8" });

  await new Promise((resolve, reject) => {
    stream
      .on("error", () => {
        reject(new Error("FS operation failed"));
      })
      .on("end", () => {
        resolve();
      })
      .pipe(process.stdout);
  });
};

await read();
