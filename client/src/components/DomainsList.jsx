import { createTurboResource } from "turbo-solid";
import { For, createMemo, createUniqueId, createSignal, Show } from "solid-js";
import { FaSolidX } from "solid-icons/fa";
import axios from "axios";
import * as dialog from "@zag-js/dialog";
import { Portal } from "solid-js/web";
import { useMachine, normalizeProps } from "@zag-js/solid";

export default function DomainsList() {
  const [domains, { mutate }] = createTurboResource(() => "/api/domains");
  const [state, send] = useMachine(dialog.machine({ id: createUniqueId() }));
  const [flagged, setFlagged] = createSignal(0);

  const api = createMemo(() => dialog.connect(state, send, normalizeProps));

  function showConfirmDialog(domain) {
    setFlagged(domain);
    api().open();
  }

  async function removeDomain() {
    console.log(flagged().id);
    mutate(domains().filter((domain) => flagged().id !== domain.id));
    api().close();
    await axios.delete(`/api/domains/${flagged().id}`);
  }

  return (
    <div id="domains-list">
      <For each={domains()} fallback={<div>there are no domains</div>}>
        {(domain) => (
          <div class="mb-1 flex rounded bg-slate-100 p-2 dark:bg-slate-800">
            <div class="mr-8">{domain.name}</div>
            <div class="ml-auto">
              <button
                class="rounded-full border bg-slate-200 p-1 text-xs text-red-500 dark:border-slate-600 dark:bg-slate-700"
                onClick={() => showConfirmDialog(domain)}
              >
                <FaSolidX />
              </button>
            </div>
          </div>
        )}
      </For>
      <Show when={api().isOpen}>
        <Portal>
          <div {...api().backdropProps} class="backdrop" />
          <div {...api().underlayProps} class="modal underlay">
            <div {...api().contentProps} class="content w-11/12 max-w-lg">
              <div class="display">
                <header>
                  <h2 {...api().titleProps}>Delete Domain</h2>
                </header>
                <div {...api().descriptionProps} class="py-4">
                  <p>
                    Are you sure you want to delete domain {flagged().name}?
                  </p>
                </div>
                <footer class="flex justify-between">
                  <button {...api().closeButtonProps} class="button danger">
                    Cancel
                  </button>
                  <button onClick={() => removeDomain()} class="button primary">
                    Confirm
                  </button>
                </footer>
              </div>
            </div>
          </div>
        </Portal>
      </Show>
    </div>
  );
}
