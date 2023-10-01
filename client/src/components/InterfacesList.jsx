import { createTurboResource } from "turbo-solid";
import {
  createMemo,
  createUniqueId,
  For,
  Switch,
  Match,
  createEffect,
  on,
} from "solid-js";
import * as accordion from "@zag-js/accordion";
import { normalizeProps, useMachine } from "@zag-js/solid";
import {
  FaSolidEthernet,
  FaSolidWifi,
  FaBrandsBluetoothB,
} from "solid-icons/fa";
import { Motion } from "@motionone/solid";

const Loading = () => <div>retrieving interfaces...</div>;

export default function InterfacesList() {
  const [interfaces] = createTurboResource(() => "/api/interfaces");
  const [activeInterface] = createTurboResource(() => "/api/interfaces/active");
  const [state, send] = useMachine(accordion.machine({ id: createUniqueId() }));

  const api = createMemo(() => accordion.connect(state, send, normalizeProps));

  createEffect(
    on(activeInterface, () => {
      api().setValue(activeInterface()?.mac_address);
    })
  );

  return (
    <div>
      <For each={interfaces()} fallback={Loading}>
        {(item) => (
          <div
            class="border-b border-slate-300 dark:border-slate-600"
            {...api().getItemProps({ value: item.mac_address })}
          >
            <div>
              <button
                class="flex w-full items-center bg-slate-100 py-2 px-4 text-left dark:bg-slate-700"
                {...api().getTriggerProps({ value: item.mac_address })}
              >
                <span
                  class={`mr-2 ${
                    activeInterface()?.mac_address === item.mac_address
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  <Switch fallback={<FaSolidEthernet />}>
                    <Match keyed when={item.type === "Wireless"}>
                      <FaSolidWifi />
                    </Match>
                    <Match keyed when={item.model.includes("Bluetooth")}>
                      <FaBrandsBluetoothB />
                    </Match>
                  </Switch>
                </span>
                {item.name}
              </button>
            </div>
            <Motion.div
              class="p-4"
              animate={{
                opacity: api().getItemState({ value: item.mac_address }).isOpen
                  ? 1
                  : 0,
                scale: api().getItemState({ value: item.mac_address }).isOpen
                  ? 1
                  : 0.95,
              }}
              transition={{ duration: 0.15, easing: "ease-in-out" }}
              {...api().getContentProps({ value: item.mac_address })}
            >
              <div>mac address: {item.mac_address}</div>
              <div>ip address: {item.ip_address}</div>
              <div>vendor: {item.vendor}</div>
              <div>model: {item.model}</div>
              <div>type: {item.type}</div>
              <div>gateway ip: {item.gateway_ip}</div>
              <div>netmask: {item.netmask}</div>
            </Motion.div>
          </div>
        )}
      </For>
    </div>
  );
}
