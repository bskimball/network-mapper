import { reporter } from "@felte/reporter-solid";
import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-yup";
import * as radio from "@zag-js/radio-group";
import { normalizeProps, useMachine } from "@zag-js/solid";
import axios from "axios";
import { debounce } from "lodash/function.js";
import { BsPlus, BsX } from "solid-icons/bs";
import {
  createEffect,
  createMemo,
  createUniqueId,
  For,
  onMount,
  Show,
} from "solid-js";
import { createStore } from "solid-js/store";
import { createTurboResource } from "turbo-solid";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";

const [store, setStore] = createStore({
  isp: [{ uuid: uuidv4(), staticIp: "no" }],
});

export default function ISPList() {
  const [isp] = createTurboResource(() => "/api/isp");

  createEffect(() => {
    if (isp()?.value?.length > 0) {
      setStore("isp", () => Object.values(isp().value));
    }
  }, isp());

  return (
    <>
      <For each={store.isp}>
        {(isp, index) => (
          <div class="mb-4">
            <ISPForm item={isp} />
            <Show when={index() < store.isp.length - 1}>
              <hr class="mt-4" />
            </Show>
          </div>
        )}
      </For>
    </>
  );
}

function StaticRadio(props) {
  const items = [
    { id: "no", label: "No" },
    { id: "yes", label: "Yes" },
  ];
  const [state, send] = useMachine(
    radio.machine({
      id: createUniqueId(),
      name: "staticIp",
      value: props.value || "no",
      onChange({ value }) {
        console.log("cchanges");
        const event = {
          target: {
            name: "staticIp",
            value,
          },
        };
        props.onInput(event);
      },
    })
  );
  const api = createMemo(() => radio.connect(state, send, normalizeProps));

  onMount(() => {
    api().setValue(props.value);
  });

  return (
    <div {...api().rootProps}>
      <div class="block" {...api().labelProps}>
        Static IP
      </div>
      <div class="flex gap-3">
        <For each={items}>
          {(item) => (
            <label
              class="cursor-pointer flex items-center gap-2"
              {...api().getRadioProps({ value: item.id })}
            >
              <span {...api().getRadioLabelProps({ value: item.id })}>
                {item.label}
              </span>
              <input {...api().getRadioInputProps({ value: item.id })} />
              <div
                class={`radio-input h-[16px] w-[16px] ${
                  item.id === api().value ? "bg-blue-500" : "bg-white"
                }`}
                {...api().getRadioControlProps({ value: item.id })}
              >
                <Show when={item.id === api().value}>
                  <div class="rounded-full bg-white h-[8px] w-[8px]"></div>
                </Show>
              </div>
            </label>
          )}
        </For>
      </div>
    </div>
  );
}

const schema = yup.object({
  name: yup.string().required("ISP name is required"),
  account: yup.string().required(),
  staticIp: yup.string().required(),
  ipAddress: yup
    .string()
    .when("staticIp", ([staticIp], schema) =>
      staticIp === "yes" ? schema.required() : schema
    ),
  gateway: yup
    .string()
    .when("staticIp", ([staticIp], schema) =>
      staticIp === "yes" ? schema.required() : schema
    ),
});

function ISPForm(props) {
  const { form, data, isValid, validate, errors, setFields } = createForm({
    extend: [validator({ schema }), reporter],
    onSubmit: async (values) => {
      const { data } = await axios.post(`/api/isp`);
      console.log({ values });
    },
  });

  onMount(async () => {
    setFields({ ...props.item });
    await validate();
  });

  const onInput = debounce(async (event) => {
    if (errors()[event.target.name] === null) {
      await axios.patch(`/api/isp/${props.item.uuid}`, {
        uuid: props.item.uuid,
        [event.target.name]: event.target.value,
      });
    }
  }, 500);

  return (
    <form
      id="isp-form"
      class="flex flex-col gap-y-3"
      use:form
      autocomplete="off"
    >
      <div>
        <label class="block" for="isp">
          Internet Service Provider
        </label>
        <input
          type="text"
          id="isp"
          class="form-input"
          name="name"
          placeholder="Comcast"
          onInput={onInput}
        />
      </div>
      <div>
        <label class="block" for="account">
          Account Number
        </label>
        <input
          type="text"
          id="account"
          class="form-input"
          name="account"
          placeholder="123456789"
          onInput={onInput}
        />
      </div>
      <StaticRadio
        onInput={(event) => {
          onInput(event);
          setFields("staticIp", () => event.target.value, true);
        }}
        value={data().staticIp}
      />
      <Show when={data().staticIp === "yes"}>
        <div>
          <label for="ipAddress">IP range in cidr format</label>
          <input
            type="text"
            id="ipAddress"
            class="form-input"
            name="ipAddress"
            placeholder="179.20.74.184/29"
            onInput={onInput}
          />
        </div>
        <div>
          <label for="gateway">ISP Gateway</label>
          <input
            type="text"
            id="gateway"
            class="form-input"
            name="gateway"
            placeholder="179.20.74.185"
            onInput={onInput}
          />
        </div>
      </Show>
      <div class="flex">
        <button
          class="button primary flex items-center"
          onClick={() =>
            setStore("isp", async (prev) => {
              const { data } = await axios.delete(
                `/api/isp/${props.item.uuid}`
              );
              console.log({ data });
              prev.filter((p, i) => i !== prev.length - 1);
            })
          }
        >
          <span>
            <BsX size={24} />
          </span>
          remove ISP
        </button>
        <Show
          when={
            props.item.uuid === store.isp[store.isp.length - 1].uuid &&
            isValid()
          }
        >
          <button
            class="button ml-auto primary flex items-center gap-1"
            onClick={async () => {
              const uuid = uuidv4();
              setStore("isp", (prev) => [...prev, { uuid, staticIp: "no" }]);
              await axios.post("/api/isp", { uuid });
            }}
          >
            <span>
              <BsPlus size={24} />
            </span>
            add ISP
          </button>
        </Show>
      </div>
    </form>
  );
}
