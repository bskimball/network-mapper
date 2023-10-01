import { Show, For } from "solid-js";
import { createTurboResource } from "turbo-solid";

export default function WhoIs(props) {
  const [data] = createTurboResource(() => `/api/whois/${props.domain}`);

  return (
    <div class={props.class}>
      <Show when={data()} fallback={<div>retrieving whois...</div>}>
        <div>
          <div class="mb-4">
            <ul class="flex gap-4">
              <For
                each={data().nameServer && data().nameServer.split(" ")}
                fallback={<div></div>}
              >
                {(ns, i) => (
                  <li class="text-xs lowercase text-slate-600 dark:text-slate-400">
                    {ns}
                  </li>
                )}
              </For>
            </ul>
          </div>
          <div>
            <div class="text-2xl">{data().registrantOrganization}</div>
            <a
              class="block lowercase text-blue-800 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-400"
              href={`http://${data().domainName}`}
              target="_blank"
            >
              {data().domainName}
            </a>
            <small class="text-xs text-slate-700 dark:text-slate-300">
              {data().registrantCity}, {data().registrantStateProvince},{" "}
              {data().registrantCountry}
            </small>
          </div>
        </div>
      </Show>
    </div>
  );
}
