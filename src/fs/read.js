import fs from "fs/promises";

const read = async () => {
  const filePath = new URL("./files/fileToRead.txt", import.meta.url);

  try {
    const content = await fs.readFile(filePath, "utf8");
    console.log(content);
  } catch {
    throw new Error("FS operation failed");
  }
};

await read();
