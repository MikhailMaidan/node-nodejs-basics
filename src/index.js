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

const readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "",
});

readLine.on("SIGINT", () => {
  console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
  process.exit(0);
});

readLine.on("line", (line) => {
  const input = line.trim();

  if (input === ".exit") {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
    process.exit(0);
  }

  console.log(`You typed: ${input}`);

  console.log(`You are currently in ${process.cwd()}`);
  readLine.prompt();
});

readLine.prompt();
