import { spawn } from "child_process";
import { fileURLToPath } from "url";

const spawnChildProcess = async (args) => {
  const scriptPath = fileURLToPath(
    new URL("./files/script.js", import.meta.url)
  );

  const child = spawn(process.execPath, [scriptPath, ...args], {
    stdio: ["pipe", "pipe", "inherit"],
  });

  process.stdin.pipe(child.stdin);
  child.stdout.pipe(process.stdout);

  await new Promise((resolve) => child.on("exit", resolve));
};

spawnChildProcess(["function1", "function2", "function3"]);
