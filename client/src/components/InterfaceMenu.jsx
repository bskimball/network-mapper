import * as menu from "@zag-js/menu";
import { normalizeProps, useMachine } from "@zag-js/solid";
import { createMemo, createUniqueId } from "solid-js";
import { Motion } from "@motionone/solid";
import InterfacesList from "./InterfacesList.jsx";

export default function InterfaceMenu() {
  const [state, send] = useMachine(menu.machine({ id: createUniqueId() }));

  const api = createMemo(() => menu.connect(state, send, normalizeProps));

  return (
    <div>
      <button
        class="button bg-slate-100 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-900 dark:focus:bg-slate-900 dark:active:bg-slate-900"
        {...api().triggerProps}
      >
        Interfaces{" "}
        <span class="ml-2 text-xs" aria-hidden>
          &#9660;
        </span>
      </button>
      <div {...api().positionerProps}>
        <Motion.div
          class="dropdown w-96 origin-top-right"
          animate={{
            opacity: api().isOpen ? 1 : 0,
            scale: api().isOpen ? 1 : 0.95,
          }}
          transition={{ duration: 0.15, easing: "ease-in-out" }}
          {...api().contentProps}
        >
          <InterfacesList />
        </Motion.div>
      </div>
    </div>
  );
}
