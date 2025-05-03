const readline = require("readline");
const os = require("os");
const path = require("path");

const args = process.argv.slice(2);
const usernameArg = args.find((arg) => arg.startsWith("--username="));

if (!usernameArg) {
  console.error("You missed required argument: --username=your_username");
  process.exit(1);
}

const username = usernameArg.split("=")[1];

process.chdir(os.homedir());

console.log(`Welcome to the File Manager, ${username}!`);
console.log(`You are currently in ${process.cwd()}`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

rl.on("SIGINT", () => {
  console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
});

rl.on("line", (line) => {
  const input = line.trim();

  if (input === ".exit") {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
    process.exit(0);
  }

  if (input === "up") {
    const parent = path.dirname(process.cwd());
    if (parent !== process.cwd()) {
      process.chdir(parent);
    }
    console.log(`You are currently in ${process.cwd()}`);
    return rl.prompt();
  }

  if (input.startsWith("cd ")) {
    const target = input.slice(3).trim();
    const newPath = path.isAbsolute(target)
      ? target
      : path.resolve(process.cwd(), target);
    try {
      process.chdir(newPath);
      console.log(`You are currently in ${process.cwd()}`);
    } catch (err) {
      console.log("Operation failed");
      console.log(`You are currently in ${process.cwd()}`);
    }
    return rl.prompt();
  }

  console.log("Invalid input");
  console.log(`You are currently in ${process.cwd()}`);
  rl.prompt();
});

rl.prompt();
