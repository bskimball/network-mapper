import emitter from "../emitter.js";
import Device from "../models/Device.js";
import nmap from "../nmap.js";
import grabIP from "./grabIP.js";
import isArray from "lodash/isArray.js";
import * as fs from "node:fs/promises";

async function insertInDatabase(host) {
  console.log(host);
  const mac = isArray(host.address)
    ? host.address.filter((a) => a.addrtype === "mac")[0]
    : "";
  const macAddress = mac.addr;
  const vendor = mac.vendor ? mac.vendor : "";
  const status = host.status.state;
  const address = JSON.stringify(host.address);
  const hostnames = host.hostnames;
  const data = await Device.create(
    {
      macAddress,
      status,
      address,
      hostnames,
      vendor,
    },
    "*"
  );
  return data[0];
}

export default async function runDiscovery(ips) {
  console.log("perform discovery");
  await fs.writeFile("./logs/lanScan.log", "");
  return Promise.all(
    ips.map(async (ip) => {
      const scan = await nmap([ip, "-sn"]);
      console.log(scan.args);
      if (scan.host) {
        const data = await insertInDatabase(scan.host);
        emitter.emit("lan:device", data);
        await fs.writeFile(
          "./logs/lanScan.log",
          `${JSON.stringify(scan, null, 2)},\n`,
          { flag: "a+" }
        );
        return grabIP(scan.host.address);
      }
    })
  );
}
