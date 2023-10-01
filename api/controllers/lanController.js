import emitter from "../emitter.js";
import Device from "../models/Device.js";
import runDeepScan from "../repositories/runDeepScan.js";
import runDiscovery from "../repositories/runDiscovery.js";
import { Netmask } from "netmask";
import network from "network";

let isRunning = false;

async function performLanScan() {
  console.log("perform lan scan");
  isRunning = true;
  await Device.destroy({ truncate: true });
  network.get_active_interface(async function (err, obj) {
    if (err) {
      throw new Error(err);
    }

    const ips = [];

    const block = new Netmask(`${obj.ip_address}/${obj.netmask}`);
    block.forEach((ip) => ips.push(ip));

    emitter.emit("lan:message", "lan:scan:start");
    const foundIPs = await runDiscovery(ips);
    await runDeepScan(foundIPs);
    isRunning = false;
    emitter.emit("lan:message", "lan:scan:complete");
  });
}

export default async function (fastify) {
  await fastify.get("/api/lan", async () => {
    const devices = await Device.findAll();
    console.log({ devices });
    return devices;
  });

  await fastify.get("/ws/lan", { websocket: true }, async (connection) => {
    connection.socket.on("message", async (message) => {
      console.log(message.toString());
      if (message.toString() === "scan:deep") {
        const addresses = await Device.findAll();
        const ips = addresses.map(({ address }) => grabIP(address));
        console.log(ips);
        await runDeepScan(ips);
      }
      if (message.toString() === "scan:status") {
        connection.socket.send(JSON.stringify({ isRunning }));
      }
      if (message.toString() === "scan:lan") {
        await performLanScan();
      }
      emitter.on("lan:device", (device) =>
        connection.socket.send(JSON.stringify(device))
      );
      emitter.on("lan:message", (message) => connection.socket.send(message));
    });
  });
}
