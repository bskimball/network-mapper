import { createTurboResource } from "turbo-solid";
import { Show } from "solid-js";
import { FaSolidLocationDot } from "solid-icons/fa";

export default function IPInfo() {
  const [data] = createTurboResource(() => "/api/ip_info");

  return (
    <div>
      <div class="mb-2 text-2xl">IP Info</div>
      <Show when={data()} fallback={<div>retrieving ip info...</div>}>
        <div class="mb-3">
          <div class="text-2xl font-bold">
            <span class="mr-4">{data().ip}</span>
            <small class="text-xs text-blue-800 dark:text-blue-100">
              {data().hostname}
            </small>
          </div>
          <div class="text-blue-800 dark:text-blue-300">{data().org}</div>
        </div>
        <div class="flex items-center rounded-full border border-slate-200 bg-slate-100 p-2 dark:border-slate-700 dark:bg-slate-800">
          <div class="mr-2 rounded-full border border-slate-200 bg-white p-2 text-xs text-red-500 dark:border-slate-700 dark:bg-slate-900">
            <FaSolidLocationDot />
          </div>
          <div>
            <span class="mr-4">
              {data().city}, {data().region}{" "}
            </span>
            <span>
              <small class="text-xs text-blue-800 dark:text-blue-100">
                {data().loc}
              </small>
            </span>
          </div>
        </div>
      </Show>
    </div>
  );
}
