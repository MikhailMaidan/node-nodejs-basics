const readline = require("readline");
const os = require("os");
const path = require("path");
const fs = require("fs");

const args = process.argv.slice(2);
const usernameArg = args.find((a) => a.startsWith("--username="));
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
    if (parent !== process.cwd()) process.chdir(parent);
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
    } catch {
      console.log("Operation failed");
      console.log(`You are currently in ${process.cwd()}`);
    }
    return rl.prompt();
  }

  if (input === "ls") {
    try {
      const names = fs.readdirSync(process.cwd());
      const entries = names.map((name) => {
        const full = path.join(process.cwd(), name);
        const stat = fs.statSync(full);
        return { name, isDir: stat.isDirectory() };
      });
      entries.sort((a, b) => {
        if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
        return a.name.localeCompare(b.name);
      });

      console.log("Type\tName");
      entries.forEach((e) =>
        console.log(`${e.isDir ? "dir " : "file"}\t${e.name}`)
      );
    } catch {
      console.log("Operation failed");
    }
    console.log(`You are currently in ${process.cwd()}`);
    return rl.prompt();
  }

  if (input.startsWith("cat ")) {
    const target = input.slice(4).trim();
    const fullPath = path.isAbsolute(target)
      ? target
      : path.resolve(process.cwd(), target);

    try {
      const stat = fs.statSync(fullPath);
      if (!stat.isFile()) throw new Error();

      const rs = fs.createReadStream(fullPath, "utf8");
      rs.on("error", () => {
        console.log("Operation failed");
        console.log(`You are currently in ${process.cwd()}`);
        rl.prompt();
      });
      rs.on("end", () => {
        console.log();
        console.log(`You are currently in ${process.cwd()}`);
        rl.prompt();
      });
      rs.pipe(process.stdout);
    } catch {
      console.log("Operation failed");
      console.log(`You are currently in ${process.cwd()}`);
      rl.prompt();
    }
    return;
  }

  if (input.startsWith("add ")) {
    const name = input.slice(4).trim();
    const fullPath = path.resolve(process.cwd(), name);

    try {
      fs.writeFileSync(fullPath, "", { flag: "wx" });
    } catch {
      console.log("Operation failed");
      console.log(`You are currently in ${process.cwd()}`);
      return rl.prompt();
    }
    console.log(`You are currently in ${process.cwd()}`);
    return rl.prompt();
  }

  if (input.startsWith("mkdir ")) {
    const name = input.slice(6).trim();
    const fullPath = path.resolve(process.cwd(), name);

    try {
      fs.mkdirSync(fullPath);
    } catch {
      console.log("Operation failed");
      console.log(`You are currently in ${process.cwd()}`);
      return rl.prompt();
    }
    console.log(`You are currently in ${process.cwd()}`);
    return rl.prompt();
  }

  console.log("Invalid input");
  console.log(`You are currently in ${process.cwd()}`);
  rl.prompt();
});

rl.prompt();
