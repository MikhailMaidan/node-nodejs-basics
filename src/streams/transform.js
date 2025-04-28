import { Transform } from "stream";
import { pipeline } from "stream/promises";

const transform = async () => {
  const reverse = new Transform({
    transform(chunk, callback) {
      try {
        const str = chunk.toString();
        const rev = str.split("").reverse().join("");
        callback(null, rev);
      } catch (err) {
        callback(err);
      }
    },
  });

  await pipeline(process.stdin, reverse, process.stdout);
};

await transform();
