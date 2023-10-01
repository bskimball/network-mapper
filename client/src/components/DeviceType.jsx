import isArray from "lodash/isArray.js";
import {
  FaSolidPrint,
  FaSolidMobile,
  FaSolidComputer,
  FaSolidQuestion,
  FaSolidHardDrive,
  FaSolidGlobe,
  FaSolidPhone,
} from "solid-icons/fa";
import { createMemo, Match, Switch } from "solid-js";

let types = {
  PRINTER: "printer",
  MOBILE: "mobile",
  COMPUTER: "computer",
  PHONE: "phone",
  STORAGE: "storage",
  ROUTER: "router",
};

const hasInVendor = (device, str) => {
  return device.vendor.toLowerCase().includes(str.toLowerCase());
};

const hasInName = (device, str) => {
  if (!device.os) return;
  const { osmatch } = device?.os;
  if (isArray(osmatch)) {
    return osmatch.some((dev) =>
      dev?.name.toLowerCase().includes(str.toLowerCase())
    );
  }
  return osmatch?.name.toLowerCase().includes(str.toLowerCase());
};

const hasPortOpen = (device, str) => {
  if (!device.ports) return;
  const { port } = device.ports;
  const compare = (p) => p?.portid === str;
  return isArray(port) ? port.some((p) => compare(p)) : compare(port);
};

export default function DeviceType(props) {
  console.log(props.device);
  const size = 36;

  const gatherType = createMemo(() => {
    if (
      hasInName(props.device, "printer") &&
      hasPortOpen(props.device, "9100")
    ) {
      return types.PRINTER;
    }
    if (
      hasInName(props.device, "apple") &&
      hasPortOpen(props.device, "62078")
    ) {
      return types.MOBILE;
    }
    if (hasInName(props.device, "windows")) {
      return types.COMPUTER;
    }
    if (hasPortOpen(props.device, "5060")) {
      return types.PHONE;
    }
    if (hasPortOpen(props.device, "445") || hasPortOpen(props.device, "873")) {
      return types.STORAGE;
    }
    if (hasInVendor(props.device, "arris")) {
      return types.ROUTER;
    }
  });

  return (
    <div class="rounded-full inline-flex p-8 border">
      <Switch fallback={<FaSolidQuestion size={size} />}>
        <Match when={gatherType() === types.PRINTER}>
          <FaSolidPrint size={size} />
        </Match>
        <Match when={gatherType() === types.MOBILE}>
          <FaSolidMobile size={size} />
        </Match>
        <Match when={gatherType() === types.COMPUTER}>
          <FaSolidComputer size={size} />
        </Match>
        <Match when={gatherType() === types.STORAGE}>
          <FaSolidHardDrive size={size} />
        </Match>
        <Match when={gatherType() === types.ROUTER}>
          <FaSolidGlobe size={size} />
        </Match>
        <Match when={gatherType() === types.PHONE}>
          <FaSolidPhone size={size} />
        </Match>
      </Switch>
    </div>
  );
}
