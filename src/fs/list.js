import fs from "fs/promises";

const list = async () => {
  const dirPath = new URL("./files", import.meta.url);

  try {
    const items = await fs.readdir(dirPath);

    console.log(items);
  } catch {
    throw new Error("FS operation failed");
  }
};

await list();
