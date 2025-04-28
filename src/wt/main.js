import { Worker } from "worker_threads";
import os from "os";
import { fileURLToPath } from "url";

const performCalculations = async () => {
  const workerPath = fileURLToPath(new URL("./worker.js", import.meta.url));
  const start = 10;

  const spawn = (n) =>
    new Promise((resolve) => {
      const w = new Worker(workerPath, { type: "module" });
      w.once("message", (data) => resolve({ status: "resolved", data })).once(
        "error",
        () => resolve({ status: "error", data: null })
      );
      w.postMessage(n);
    });

  const promises = os.cpus().map((_, i) => spawn(start + i));

  console.log(await Promise.all(promises));
};

await performCalculations();
