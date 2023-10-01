import { spawn } from "node:child_process";
import { parseStringPromise as parseXml } from "xml2js";

async function exec(args) {
  args.unshift("-oX", "-");
  args.push("--privileged");

  let childOutput = "";

  const child = await spawn("nmap", args);

  child.stdout.on("data", (chunk) => {
    childOutput += chunk.toString();
  });

  return new Promise((resolve, reject) => {
    child.on("exit", (code) => {
      if (code !== 0) {
        return reject(`Nmap child process has exited with code: ${code}`);
      }

      resolve(childOutput);
    });
  });
}

export default async function (args) {
  try {
    const scan = await exec(args);

    const { nmaprun } = await parseXml(scan, {
      mergeAttrs: true,
      explicitArray: false,
    });

    return nmaprun;
  } catch (e) {
    throw new Error(e);
  }
}
