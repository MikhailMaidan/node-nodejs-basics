const readline = require("readline");
const os = require("os");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

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
      entries.sort((a, b) =>
        a.isDir === b.isDir ? a.name.localeCompare(b.name) : a.isDir ? -1 : 1
      );
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
    const full = path.isAbsolute(target)
      ? target
      : path.resolve(process.cwd(), target);
    try {
      const stat = fs.statSync(full);
      if (!stat.isFile()) throw new Error();
      const rs = fs.createReadStream(full, "utf8");
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
    const full = path.resolve(process.cwd(), name);
    try {
      fs.writeFileSync(full, "", { flag: "wx" });
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
    const full = path.resolve(process.cwd(), name);
    try {
      fs.mkdirSync(full);
    } catch {
      console.log("Operation failed");
      console.log(`You are currently in ${process.cwd()}`);
      return rl.prompt();
    }
    console.log(`You are currently in ${process.cwd()}`);
    return rl.prompt();
  }

  if (input.startsWith("rn ")) {
    const parts = input.split(" ").slice(1);
    if (parts.length !== 2) {
      console.log("Invalid input");
      console.log(`You are currently in ${process.cwd()}`);
      return rl.prompt();
    }
    const [oldRaw, newName] = parts;
    const oldFull = path.isAbsolute(oldRaw)
      ? oldRaw
      : path.resolve(process.cwd(), oldRaw);
    const newFull = path.join(path.dirname(oldFull), newName);
    try {
      fs.renameSync(oldFull, newFull);
    } catch {
      console.log("Operation failed");
      console.log(`You are currently in ${process.cwd()}`);
      return rl.prompt();
    }
    console.log(`You are currently in ${process.cwd()}`);
    return rl.prompt();
  }

  if (input.startsWith("rm ")) {
    const target = input.slice(3).trim();
    const full = path.isAbsolute(target)
      ? target
      : path.resolve(process.cwd(), target);
    try {
      fs.unlinkSync(full);
    } catch {
      console.log("Operation failed");
      console.log(`You are currently in ${process.cwd()}`);
      return rl.prompt();
    }
    console.log(`You are currently in ${process.cwd()}`);
    return rl.prompt();
  }

  if (input.startsWith("cp ")) {
    const [, , srcRaw, destRaw] = input.split(" ");
    const src = path.isAbsolute(srcRaw)
      ? srcRaw
      : path.resolve(process.cwd(), srcRaw);
    const destDir = path.isAbsolute(destRaw)
      ? destRaw
      : path.resolve(process.cwd(), destRaw);
    const destPath = path.join(destDir, path.basename(srcRaw));
    try {
      const rs = fs.createReadStream(src);
      const ws = fs.createWriteStream(destPath);
      rs.on("error", () => {
        console.log("Operation failed");
        console.log(`You are currently in ${process.cwd()}`);
        rl.prompt();
      });
      ws.on("error", () => {
        console.log("Operation failed");
        console.log(`You are currently in ${process.cwd()}`);
        rl.prompt();
      });
      ws.on("finish", () => {
        console.log(`You are currently in ${process.cwd()}`);
        rl.prompt();
      });
      rs.pipe(ws);
    } catch {
      console.log("Operation failed");
      console.log(`You are currently in ${process.cwd()}`);
      rl.prompt();
    }
    return;
  }

  if (input.startsWith("mv ")) {
    const [, , srcRaw, destRaw] = input.split(" ");
    const src = path.isAbsolute(srcRaw)
      ? srcRaw
      : path.resolve(process.cwd(), srcRaw);
    const destDir = path.isAbsolute(destRaw)
      ? destRaw
      : path.resolve(process.cwd(), destRaw);
    const destPath = path.join(destDir, path.basename(srcRaw));
    try {
      const rs = fs.createReadStream(src);
      const ws = fs.createWriteStream(destPath);
      rs.on("error", () => {
        console.log("Operation failed");
        console.log(`You are currently in ${process.cwd()}`);
        rl.prompt();
      });
      ws.on("error", () => {
        console.log("Operation failed");
        console.log(`You are currently in ${process.cwd()}`);
        rl.prompt();
      });
      ws.on("finish", () => {
        try {
          fs.unlinkSync(src);
        } catch {}
        console.log(`You are currently in ${process.cwd()}`);
        rl.prompt();
      });
      rs.pipe(ws);
    } catch {
      console.log("Operation failed");
      console.log(`You are currently in ${process.cwd()}`);
      rl.prompt();
    }
    return;
  }

  if (input.startsWith("os ")) {
    const flag = input.split(" ")[1];
    switch (flag) {
      case "--EOL":
        console.log(JSON.stringify(os.EOL));
        break;
      case "--cpus":
        const cpus = os.cpus();
        console.log(`Total CPUs: ${cpus.length}`);
        cpus.forEach((cpu, i) =>
          console.log(
            `CPU ${i}: ${cpu.model}, ${Math.round(cpu.speed / 1000)} GHz`
          )
        );
        break;
      case "--homedir":
        console.log(os.homedir());
        break;
      case "--username":
        console.log(os.userInfo().username);
        break;
      case "--architecture":
        console.log(os.arch());
        break;
      default:
        console.log("Invalid input");
    }
    console.log(`You are currently in ${process.cwd()}`);
    return rl.prompt();
  }

  if (input.startsWith("hash ")) {
    const target = input.slice(5).trim();
    const full = path.isAbsolute(target)
      ? target
      : path.resolve(process.cwd(), target);
    try {
      const rs = fs.createReadStream(full);
      const hash = crypto.createHash("sha256");
      rs.on("data", (chunk) => hash.update(chunk));
      rs.on("end", () => {
        console.log(hash.digest("hex"));
        console.log(`You are currently in ${process.cwd()}`);
        rl.prompt();
      });
      rs.on("error", () => {
        console.log("Operation failed");
        console.log(`You are currently in ${process.cwd()}`);
        rl.prompt();
      });
    } catch {
      console.log("Operation failed");
      console.log(`You are currently in ${process.cwd()}`);
      rl.prompt();
    }
    return;
  }

  console.log("Invalid input");
  console.log(`You are currently in ${process.cwd()}`);
  rl.prompt();
});

rl.prompt();
