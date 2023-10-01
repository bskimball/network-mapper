import network from "network";
import whois from "whois-json";

export default async function (fastify) {
  await fastify.get("/api/whois", (_request, reply) => {
    network.get_public_ip(async function (err, ip) {
      if (err) {
        throw new Error(err);
      }
      try {
        const data = await whois(ip);
        reply.send(data);
      } catch (e) {
        console.log(e)
      }
    });
  });

  await fastify.get("/api/whois/:domain", async (request) => {
    const { domain } = request.params;
    try {
      return await whois(domain);
    } catch (e) {
      console.log(e);
    }
  });
}
