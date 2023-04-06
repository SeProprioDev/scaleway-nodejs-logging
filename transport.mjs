import build from "pino-abstract-transport";
import invariant from "tiny-invariant";
import axios from "axios";

export default async function (opts) {
  invariant(opts.url, "url is required for the transport");
  invariant(opts.labels.job, "job label is required for the transport");

  const labels = opts.labels;

  return build(
    async function (source) {
      for await (let obj of source) {
        const now = new Date();
        const unixEpochInNanoseconds = now.getTime() * 1000000;
        const values = [
          [unixEpochInNanoseconds.toString(), JSON.stringify(obj)],
        ];
        try {
          await axios.post(opts.url, {
            streams: [
              {
                stream: {
                  ...labels,
                },
                values,
              },
            ],
          });
        } catch (error) {
          console.error("loki transport error:", error);
        }
      }
    },
    {
      async close(err) {},
    }
  );
}
