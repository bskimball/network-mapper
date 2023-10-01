import Fastify from "fastify";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify({
  logger: true,
});
const port = 4000;

await fastify.register(import("@fastify/compress"));
await fastify.register(import("@fastify/websocket"));
await fastify.register(import("@fastify/autoload"), {
  dir: path.join(__dirname, "api", "controllers"),
});

await fastify.register(import("@fastify/static"), {
  root: path.join(__dirname, "client", "dist"),
});

await fastify.listen({ port }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.info(`Server is listening on ${address}`);
});
