import DevicesList from "../components/DevicesList.jsx";
import { createEffect, createSignal, onCleanup } from "solid-js";
import { createTurboResource } from "turbo-solid";

export default function LANNetwork() {
  let ws;
  const [devices, { mutate }] = createTurboResource(() => "/api/lan");
  const [scans, setScans] = createSignal({ lan: false });

  createEffect(() => {
    ws = new WebSocket("ws://localhost:3000/ws/lan");
    ws.onopen = () => {
      ws.send("scan:status");
    };
    ws.onmessage = ({ data }) => {
      if (data.startsWith("{")) {
        const obj = JSON.parse(data);
        if (obj.hasOwnProperty("isRunning")) {
          const { isRunning } = obj;
          return setScans({ ...scans(), lan: isRunning });
        }
        return mutate(
          devices().map((d) => (d.mac_address === obj.mac_address ? obj : d))
        );
      }
      console.log(data);
      if (data === "lan:scan:complete") {
        setScans((prev) => ({ ...prev, lan: false }));
      }
    };
    onCleanup(() => ws.close());
  });

  function runLanScan() {
    ws.send("scan:lan");
    setScans((prev) => ({ ...prev, lan: true }));
  }

  return (
    <div class="container mx-auto">
      <h1 class="mt-8 mb-4 text-2xl">LAN Network</h1>
      <div class="mb-4 flex gap-x-4">
        <button class="button accent" onClick={() => runLanScan()}>
          Scan Again <span class="text-xs">{scans().lan && "scanning"}</span>
        </button>
      </div>
      <DevicesList devices={devices()} />
    </div>
  );
}
