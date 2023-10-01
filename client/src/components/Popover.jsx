import * as popover from "@zag-js/popover";
import { normalizeProps, useMachine } from "@zag-js/solid";
import { createMemo, createUniqueId } from "solid-js";
import { FaSolidX } from "solid-icons/fa";

export default function Popover(props) {
  const [state, send] = useMachine(popover.machine({ id: createUniqueId() }));

  const api = createMemo(() => popover.connect(state, send, normalizeProps));

  return (
    <div>
      <button {...api().triggerProps}>{props.button || "Click me"}</button>
      <div {...api().positionerProps}>
        <div {...api().arrowProps}>
          <div {...api().innerArrowProps} />
        </div>
        <div
          {...api().contentProps}
          class="rounded bg-white p-6 shadow-xl dark:bg-slate-700"
        >
          <div {...api().titleProps} class="text-xl">
            {props.title || "Popover Title"}
          </div>
          <div {...api().descriptionProps}>{props.children}</div>
          <button
            {...api().closeButtonProps}
            class="absolute top-2 right-2 z-10 rounded-full p-2 text-red-500"
          >
            <FaSolidX />
          </button>
        </div>
      </div>
    </div>
  );
}
