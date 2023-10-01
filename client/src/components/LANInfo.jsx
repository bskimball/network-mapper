import { createTurboResource } from "turbo-solid";
import { Show } from "solid-js";

export default function LANInfo() {
  const [activeInterface] = createTurboResource(() => "/api/interfaces/active");
  const [dnsServers] = createTurboResource(() => "/api/dns/servers");

  return (
    <div>
      <div class="mb-2 text-xl">LAN Info</div>
      <Show
        when={activeInterface()}
        fallback={<div>getting active interface...</div>}
      >
        <div>ip: {activeInterface().ip_address}</div>
        <div>mask: {activeInterface().netmask}</div>
        <div>gw: {activeInterface().gateway_ip}</div>
        <Show
          when={dnsServers()}
          fallback={<div>retrieving dns servers...</div>}
        >
          <div>dns: {JSON.stringify(dnsServers())}</div>
        </Show>
      </Show>
    </div>
  );
}
