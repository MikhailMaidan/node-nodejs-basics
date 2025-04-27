const parseArgs = () => {
  const raw = process.argv.slice(2);
  const output = [];

  for (let i = 0; i < raw.length; i += 2) {
    const name = raw[i].startsWith("--") ? raw[i].slice(2) : raw[i];
    const value = raw[i + 1];
    output.push(`${name} is ${value}`);
  }

  console.log(output.join(", "));
};

parseArgs();
