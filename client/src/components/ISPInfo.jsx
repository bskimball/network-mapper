import { createTurboResource } from "turbo-solid";
import { Show } from "solid-js";

export default function ISPInfo() {
  const [publicIP] = createTurboResource(() => "/api/public_ip");
  const [whois] = createTurboResource(() => "/api/whois");

  return (
    <div>
      <div class="text-xl">Public Info</div>
      <Show when={publicIP()} fallback={<div>retrieving public ip...</div>}>
        <div class="text-2xl font-bold">{publicIP()}</div>
      </Show>
      <Show when={whois()} fallback={<div>retrieving whois info...</div>}>
        <div class="text-blue-800 dark:text-blue-200">{whois().orgName}</div>
      </Show>
    </div>
  );
}
