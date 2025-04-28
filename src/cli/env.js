const parseEnv = () => {
  const rssEntries = Object.entries(process.env)
    .filter(([key]) => key.startsWith("RSS_"))
    .map(([key, value]) => `${key}=${value}`);

  if (rssEntries.length > 0) {
    console.log(rssEntries.join("; "));
  } else {
    console.log("");
  }
};

parseEnv();
