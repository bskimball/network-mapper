import Configuration from "../models/Configuration.js";
import network from "network";
import { IPinfoWrapper } from "node-ipinfo";
import dns from "node:dns";

const ipInfoWrapper = new IPinfoWrapper("5ea9ca6b090125");

export default async function (fastify) {
  await fastify.get("/api/interfaces", (_request, reply) => {
    network.get_interfaces_list(function (err, list) {
      reply.send(list);
    });
  });

  await fastify.get("/api/interfaces/active", (_request, reply) => {
    network.get_active_interface(function (err, obj) {
      reply.send(obj);
    });
  });

  await fastify.get("/api/public_ip", (_request, reply) => {
    network.get_public_ip(function (err, ip) {
      reply.send(ip);
    });
  });

  await fastify.get("/api/ip_info", (_request, reply) => {
    network.get_public_ip(async function (err, ip) {
      if (err) {
        throw new Error(err);
      }
      const data = await Configuration.findAll({ where: { key: "ip_info" } });
      if (data.length < 1) {
        const ipData = await ipInfoWrapper.lookupIp(ip);
        const dbResult = await Configuration.create({
          key: "ip_info",
          value: ipData,
        });
        data.push(dbResult);
      }
      if (ip !== data[0].value.ip) {
        const ipData = await ipInfoWrapper.lookupIp(ip);
        const dbResult = await Configuration.update(
          { value: ipData },
          { where: { key: "ip_info" } }
        );
        data.push(dbResult);
      }
      reply.send(data[0].value);
    });
  });

  await fastify.get("/api/dns/servers", (_request, reply) => {
    const data = dns.getServers();
    reply.send(data);
  });
}
