import { Worker } from "worker_threads";
import { fileURLToPath } from "url";

const workerFile = fileURLToPath(new URL("./worker.js", import.meta.url));

const worker = new Worker(workerFile, { type: "module" });

worker.once("message", (result) => {
  console.log("✔ Fib(10) =", result);
  worker.terminate();
});

worker.once("error", (err) => {
  console.error("Worker error:", err);
  worker.terminate();
});

worker.postMessage(10);
