import pino from "pino";
import * as dotenv from "dotenv";

dotenv.config();

const transport = pino.transport({
  targets: [
    {
      target: "./transport.mjs",
      options: {
        url: process.env.LOKI_API_URL,
        labels: {
          job: process.env.JOB_NAME,
        },
      },
    },
    {
      target: "pino-pretty",
    },
  ],
});

const logger = pino(
  transport,
  pino.destination({
    sync: true,
  })
);

logger.info("Starting app...");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function main() {
  logger.info("Doing some heavy work...");
  await sleep(3000);
  logger.info({
    msg: "Json fetched...",
    data: {
      name: "John",
      age: 30,
      city: "New York",
    },
  });
  await sleep(3000);
  logger.info("Heavy work completed!");
}

main().then(() => {
  logger.info("All done, goodbye!");
});

await sleep(10000);
