import dotenv from "dotenv";

import fastify from "fastify";

dotenv.config();
// Require the framework and instantiate it
const server = fastify({
  logger: {
    transport: {
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
    }
  },
});

// Declare a route
server.get("/", async (request, reply) => {
  return { hello: "world" };
});

// Run the server!
const start = async () => {
  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
