import { Motion } from "@motionone/solid";
import { normalizeProps, useMachine } from "@zag-js/solid";
import * as toggle from "@zag-js/toggle";
import { FaSolidMoon, FaSolidSun } from "solid-icons/fa";
import { createEffect, createMemo, on, onMount, Show } from "solid-js";
import colors from "tailwindcss/colors.js";

export default function ModeToggle() {
  const [state, send] = useMachine(toggle.machine({ id: "dark-mode" }));
  const api = createMemo(() => toggle.connect(state, send, normalizeProps));

  createEffect(
    on(
      api,
      () => {
        document.body.classList[api().isPressed ? "add" : "remove"]("dark");
        localStorage.theme = api().isPressed ? "dark" : "light";
      },
      { defer: true }
    )
  );

  onMount(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      api().setPressed(true);
    } else {
      api().setPressed(false);
    }
  });

  return (
    <div>
      <Motion.button
        class="relative inline-flex h-8 w-14 items-center rounded-full transition"
        animate={{
          backgroundColor: api().isPressed
            ? colors.blue["500"]
            : colors.gray["200"],
        }}
        transition={{ duration: 0.15 }}
        {...api().buttonProps}
      >
        <Motion.span
          class="inline-block h-6 w-6 rounded-full border border-yellow-100 bg-yellow-100 text-orange-700 dark:text-blue-100 dark:border-blue-900 dark:bg-blue-900 p-1 flex items-center justify-center"
          animate={{ translateX: api().isPressed ? "1.8rem" : "0.25rem" }}
          transition={{ duration: 0.15 }}
        >
          <Show when={api().isPressed} fallback={<FaSolidSun />}>
            <FaSolidMoon />
          </Show>
        </Motion.span>
      </Motion.button>
    </div>
  );
}
