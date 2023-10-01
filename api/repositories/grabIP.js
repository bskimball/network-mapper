import isArray from "lodash/isArray.js";

export default function grabIP(address) {
  if (isArray(address)) {
    return address.filter((a) => a.addrtype === "ipv4")[0].addr;
  } else {
    return address.addr;
  }
}
