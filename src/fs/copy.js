import fs from "fs/promises";

const copy = async () => {
  const srcDir = new URL("./files", import.meta.url);
  const destDir = new URL("./files_copy", import.meta.url);

  try {
    const stat = await fs.stat(srcDir);
    if (!stat.isDirectory()) throw new Error();

    await fs.cp(srcDir, destDir, {
      recursive: true,
      errorOnExist: true,
      force: false,
    });
  } catch {
    throw new Error("FS operation failed");
  }
};

await copy();
