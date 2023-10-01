import DeviceType from "./DeviceType.jsx";
import OperatingSystem from "./OperatingSystem.jsx";
import Ports from "./Ports.jsx";
import isArray from "lodash/isArray.js";
import { For } from "solid-js";

function DeviceCard(props) {
  function grabIP(address) {
    if (isArray(address)) {
      return address?.filter((a) => a?.addrtype === "ipv4")[0]?.addr;
    } else {
      return address?.addr;
    }
  }

  return (
    <div class="card">
      <div class="grid grid-cols-5">
        <div>
          <DeviceType device={props.device} />
        </div>
        <div class="col-span-2">
          <div class="mb-4">
            <h3 class="text-2xl mb-2">
              <div>{props.device.vendor}</div>
            </h3>
            <div class="text-xs">{props.device.mac_address}</div>
            <div class="text-xs">{props.device.hostnames}</div>
          </div>
          <div class="flex">{grabIP(props.device.address)} </div>
        </div>
        <div>
          <OperatingSystem os={props.device?.os} />
        </div>
        <div>
          <Ports port={props.device?.ports?.port} />
        </div>
      </div>
    </div>
  );
}

export default function DevicesList(props) {
  return (
    <div class="flex flex-col gap-4">
      <For each={props.devices} fallback={<div>There are not any devices</div>}>
        {(device) => <DeviceCard device={device} />}
      </For>
    </div>
  );
}
