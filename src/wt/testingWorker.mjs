import { Worker } from "worker_threads";
import { fileURLToPath } from "url";

const workerFile = fileURLToPath(new URL("./worker.js", import.meta.url));

const worker = new Worker(workerFile, { type: "module" });

worker.once("message", (result) => {
  console.log("Fibonacci(10) =", result);
  worker.terminate();
});

worker.once("error", (err) => {
  console.error("Worker error:", err);
  worker.terminate();
});

worker.postMessage(10);

// this module was written specifically to test whether the worker.js does its job properly, so I leafe it here for clarification.
// it's enough to paste node src/wt/testingWorker.mjs in the console to the the calculated result!!!!
