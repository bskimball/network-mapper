import { Link } from "@solidjs/router";
import { For } from "solid-js";

const items = [
  { title: "Home", target: "/" },
  { title: "Configuration", target: "/configuration" },
  { title: "Domains", target: "/domains" },
  { title: "LAN", target: "/lan" },
  { title: "On-boarding", target: "/on-boarding" },
];

export default function Menu() {
  return (
    <div id="main-menu" class="flex">
      <For each={items}>
        {(item) => (
          <Link
            class="mr-2 px-3 py-1 text-slate-800 transition hover:text-slate-900 focus:text-slate-900 active:text-slate-900 dark:text-slate-200 dark:hover:text-white dark:focus:text-white dark:active:text-white"
            href={item.target}
          >
            {item.title}
          </Link>
        )}
      </For>
    </div>
  );
}
