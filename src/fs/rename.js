import fs from "fs/promises";

const rename = async () => {
  const oldPath = new URL("./files/wrongFilename.txt", import.meta.url);
  const newPath = new URL("./files/properFilename.md", import.meta.url);

  try {
    const srcStat = await fs.stat(oldPath);
    if (!srcStat.isFile()) throw new Error();

    try {
      await fs.stat(newPath);

      throw new Error();
    } catch (err) {
      if (err.code !== "ENOENT") {
        throw new Error();
      }
    }

    await fs.rename(oldPath, newPath);
  } catch {
    throw new Error("FS operation failed");
  }
};

await rename();
