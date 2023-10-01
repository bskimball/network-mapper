import { createEffect, createSignal, For, onCleanup, Show } from "solid-js";
import { createTurboResource } from "turbo-solid";
import {
  FaSolidArrowDown,
  FaSolidArrowUp,
  FaSolidCircleInfo,
} from "solid-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import startCase from "lodash/startCase";
import WhoIs from "./WhoIs.jsx";
import Popover from "./Popover.jsx";

dayjs.extend(relativeTime);

function DomainCard(props) {
  let ws;
  const [domain] = createTurboResource(() => `/api/domains/${props.domain.id}`);
  const [whois] = createTurboResource(() => `/api/whois/${props.domain.name}`);
  const [scan, setScan] = createSignal({});

  createEffect(() => {
    ws = new WebSocket(`ws://localhost:3000/ws/domains`);
    ws.onopen = () => {
      ws.send("message me about domains");
    };
    ws.onmessage = ({ data }) => {
      const wsScan = JSON.parse(data);
      console.log(wsScan);
      if (wsScan?.args.includes(props.domain.name)) {
        setScan(wsScan);
      }
    };
    onCleanup(() => ws.close());
  });

  function grabDomain(address) {
    const arr = address.split(".");
    return `${arr[arr.length - 2]}.${arr[arr.length - 1]}`;
  }

  return (
    <div class="card mb-12 w-full">
      <header class="mb-8">
        <div class="flex items-center">
          <h3 class="mr-4 text-2xl font-semibold">{props.domain.name}</h3>
          <Show
            when={scan()?.host?.status === "down"}
            fallback={
              <span class="text-green-500">
                <FaSolidArrowUp />
              </span>
            }
          >
            <span class="text-red-500">
              <FaSolidArrowDown />
            </span>
          </Show>
        </div>
        <small class="text-xs text-blue-800 dark:text-blue-200">
          {domain()?.resolve?.A}
        </small>
      </header>
      <div class="grid grid-cols-3 gap-8">
        <div class="col-span-1">
          <div class="mb-6">
            <div class="mb-1 text-lg">Name Servers</div>
            <For
              each={domain()?.resolve?.NS}
              fallback={<div>retrieving name servers...</div>}
            >
              {(item) => (
                <div>
                  <div class="mb-4 flex">
                    <div class="mr-6 font-semibold">{item}</div>
                    <div>
                      <Popover
                        button={
                          <span class="text-blue-800 dark:text-blue-300">
                            <FaSolidCircleInfo />
                          </span>
                        }
                        title={item}
                      >
                        <WhoIs domain={grabDomain(item)} />
                      </Popover>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
          <div class="mb-4">
            <div class="mb-1 text-xl">Mail Exchange</div>
            <For
              each={domain()?.resolve?.MX?.sort((a, b) =>
                a.priority > b.priority ? 1 : -1
              )}
            >
              {(item) => (
                <div>
                  <div class="mb-4 flex gap-x-8">
                    <div>{item.exchange}</div>
                    <div>{item.priority}</div>
                    <div>
                      <Popover
                        button={
                          <span class="text-blue-800 dark:text-blue-300">
                            <FaSolidCircleInfo />
                          </span>
                        }
                        title={item.exchange}
                      >
                        <WhoIs domain={grabDomain(item.exchange)} />
                      </Popover>
                    </div>
                  </div>
                </div>
              )}
            </For>
          </div>
          {/*<div>*/}
          {/*  <Show when={domain()} fallback={<div>retrieving domain</div>}>*/}
          {/*    <pre>{JSON.stringify(domain(), null, 2)}</pre>*/}
          {/*  </Show>*/}
          {/*</div>*/}
        </div>
        <div class="col-span-2 mb-6">
          <div class="mb-2 text-3xl">Who is info</div>
          <Show when={whois()} fallback={<div>retrieving who is info...</div>}>
            <div
              class={`${
                dayjs(whois().registrarRegistrationExpirationDate).diff(
                  new Date(),
                  "day"
                ) < 30
                  ? "text-red-500"
                  : "text-slate-600 dark:text-slate-400"
              } mb-3`}
            >
              expires{" "}
              {dayjs(whois().registrarRegistrationExpirationDate).fromNow()} on{" "}
              {dayjs(whois().registrarRegistrationExpirationDate).format(
                "MMMM D, YYYY"
              )}
            </div>
            <div class="mb-4">
              <div>
                created {dayjs(whois().creationDate).format("MMMM D, YYYY")}
              </div>
              <div>
                last updated {dayjs(whois().updatedDate).format("MMMM D, YYYY")}
              </div>
            </div>
            <div class="mb-4">
              <For each={whois().domainStatus.split(" ")}>
                {(item) =>
                  item.startsWith("http") ? (
                    <div class="mb-2 text-xs">
                      <a
                        href={item}
                        class="text-blue-500 underline hover:text-blue-600"
                      >
                        ({item})
                      </a>
                    </div>
                  ) : (
                    <div>{startCase(item)}</div>
                  )
                }
              </For>
            </div>
            <div id="registrar" class="mb-4">
              <h4 class="text-xl underline">Registrar</h4>
              <div class="text-2xl">{whois().registrar}</div>
              <a class="block text-xs" href={whois().registrarUrl}>
                {whois().registrarUrl}
              </a>
              <a
                class="block"
                href={`mailto:${whois().registrarAbuseContactEmail}`}
              >
                {whois().registrarAbuseContactEmail}
              </a>
              <a
                class="block"
                href={`tel:${whois().registrarAbuseContactPhone}`}
              >
                {whois().registrarAbuseContactPhone}
              </a>
              <div>reseller: {whois().reseller}</div>
            </div>
            <div id="registrant" class="mb-4">
              <div class="text-xl underline">Registrant</div>
              <div class="text-2xl">{whois().registrantName}</div>
              <div class="text-xs">{whois().registrantOrganization}</div>
            </div>
            <div id="admin" class="mb-4">
              <div class="text-xl underline">Admin Contact</div>
              <div class="text-2xl">{whois().adminName}</div>
              <div class="text-xs">{whois().adminOrganization}</div>
            </div>
            <div id="tech" class="mb-4">
              <div class="text-xl underline">Technical Contact</div>
              <div class="text-2xl">{whois().techName}</div>
              <div class="text-xs">{whois().techOrganization}</div>
            </div>
          </Show>
          {/*<div>*/}
          {/*  <pre>{JSON.stringify(whois(), null, 2)}</pre>*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  );
}

export default function DomainCards() {
  const [domains] = createTurboResource(() => "/api/domains");
  return (
    <For each={domains()} fallback={<div>no domains</div>}>
      {(item) => <DomainCard domain={item} />}
    </For>
  );
}
