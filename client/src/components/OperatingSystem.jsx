import isArray from "lodash/isArray.js";
import isObject from "lodash/isObject.js";
import { SiApple, SiLinux, SiWindows } from "solid-icons/si";
import { createMemo, For, Match, Switch } from "solid-js";

function OSIcon(props) {
  const size = 48;
  const name = props.name?.toLowerCase();

  return (
    <Switch>
      <Match when={name?.includes("windows")}>
        <div class="rounded-full p-8 border inline-flex">
          <SiWindows size={size} />
        </div>
      </Match>
      <Match when={name?.includes("apple")}>
        <div class="rounded-full p-8 border inline-flex">
          <SiApple size={size} />
        </div>
      </Match>
      <Match when={name?.includes("linux")}>
        <div class="rounded-full p-8 border inline-flex">
          <SiLinux size={size} />
        </div>
      </Match>
    </Switch>
  );
}

function OSMatch(props) {
  const Item = (itemProps) => (
    <div class="flex gap-x-2">
      <div>{itemProps.osmatch?.osclass?.type}</div>
      <div>{itemProps.osmatch?.osclass?.vendor}</div>
      <div>{itemProps.osmatch?.osclass?.osfamily}</div>
      <div>{itemProps.osmatch?.osclass?.osgen}</div>
    </div>
  );

  return (
    <Switch>
      <Match when={isArray(props.osmatch)}>
        <For each={props.osmatch}>
          {(item) => (
            <div class="flex gap-x-2">
              <Item osmatch={item} />
            </div>
          )}
        </For>
      </Match>
      <Match when={isObject(props.osmatch)}>
        <Item osmatch={props.osmatch} />
      </Match>
    </Switch>
  );
}

export default function OperatingSystem(props) {
  const grabOSName = createMemo(() =>
    isArray(props.os?.osmatch)
      ? props.os?.osmatch[0]?.name
      : props.os?.osmatch?.name
  );

  return (
    <>
      <h4>{props.os?.name}</h4>
      <OSIcon name={grabOSName()} />
      <OSMatch osmatch={props.os?.osmatch} />
      {/*<pre>{JSON.stringify(props.os, null, 2)}</pre>*/}
    </>
  );
}
