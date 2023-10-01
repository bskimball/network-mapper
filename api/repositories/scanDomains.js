import Domain from "../models/Domain.js";
import nmap from "../nmap.js";

export default async function () {
  const domains = await Domain.findAll({ attributes: ["name"] });
  console.log({ domains });
  let hosts = {};

  const exec = async () => {
    setTimeout(exec, 60000);
    domains.map(async ({ name }) => {
      const scan = await nmap([name, "-sn", "-PO"]);
      console.log(scan);
      hosts[name] = scan?.runstats?.hosts;
      console.log(hosts);
    });
  };

  setTimeout(exec, 200);
  return hosts;
}
