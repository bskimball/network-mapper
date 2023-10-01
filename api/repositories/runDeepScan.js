import emitter from "../emitter.js";
import Device from "../models/Device.js";
import nmap from "../nmap.js";
import isArray from "lodash/isArray.js";
import * as fs from "node:fs/promises";

export default async function runDeepScan(ips) {
  console.log("perform deep scan");
  await fs.writeFile("./logs/deepLanScan.log", "");
  return Promise.all(
    ips.map(async (ip) => {
      const scan = await nmap([ip, "-O"]);
      console.log(scan.args);
      if (scan.host) {
        const { ports, os } = scan.host;
        const mac = isArray(scan.host.address)
          ? scan.host.address.filter((a) => a.addrtype === "mac")[0]
          : "";
        const macAddress = mac.addr;

        if (macAddress) {
          const data = await Device.update(
            {
              ports: JSON.stringify(ports),
              os: JSON.stringify(os),
            },
            {
              where: {
                macAddress,
              },
            }
          );
          console.log("from the deep");
          emitter.emit("lan:device", data[0]);
        }
      }

      await fs.writeFile(
        "./logs/deepLanScan.log",
        `${JSON.stringify(scan, null, 2)},\n`,
        { flag: "a+" }
      );
    })
  );
}
