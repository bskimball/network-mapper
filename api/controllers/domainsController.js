import emitter from "../emitter.js";
import Domain from "../models/Domain.js";
import nmap from "../nmap.js";
import * as dns from "node:dns/promises";

export default async function (fastify) {
  const scans = {};

  const scanDomains = async () => {
    setTimeout(scanDomains, 300000);
    const domains = await Domain.findAll({ attributes: ["name"] });
    domains.map(async ({ name }) => {
      const scan = await nmap([name, "-sn", "-Pn"]);
      scans[name] = scan;
      emitter.emit("domains:scanned", scan);
    });
  };

  // setTimeout(scanDomains, 200);

  await fastify.get("/ws/domains", { websocket: true }, async (connection) => {
    connection.socket.on("message", () => {
      Object.keys(scans).forEach((name) =>
        connection.socket.send(JSON.stringify(scans[name]))
      );
      emitter.on("domains:scanned", (item) => {
        connection.socket.send(JSON.stringify(item));
      });
    });
  });

  await fastify.get("/api/domains", async () => {
    return await Domain.findAll();
  });

  await fastify.get("/api/domains/:id", async (request) => {
    const { id } = request.params;
    let resolve = {};
    const domain = await Domain.findOne({ where: { id } });

    const resolvers = ["A", "MX", "NS", "TXT", "SOA"];

    for (let i = 0; i < resolvers.length; i++) {
      let key = resolvers[i];
      try {
        resolve[key] = await dns.resolve(domain?.name, key);
      } catch (e) {
        console.log(e);
      }
    }

    return { ...domain, resolve };
  });

  await fastify.post("/api/domains", async (request) => {
    return await Domain.create(request.body);
  });

  await fastify.delete("/api/domains/:id", async (request) => {
    const { id } = request.params;
    await Domain.destroy({ where: { id } });
  });
}
