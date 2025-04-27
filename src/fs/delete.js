import fs from "fs/promises";

const remove = async () => {
  const filePath = new URL("./files/fileToRemove.txt", import.meta.url);

  try {
    await fs.unlink(filePath);
  } catch {
    throw new Error("FS operation failed");
  }
};

await remove();
