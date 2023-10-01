import isArray from "lodash/isArray.js";
import isObject from "lodash/isObject.js";
import { Match, Switch } from "solid-js";

const Item = (props) => (
  <div class="flex gap-x-1">
    <div>
      {props.port.portid}/{props.port.protocol}
    </div>
    <div>{props.port.service.name}</div>
  </div>
);

export default function Ports(props) {
  return (
    <Switch>
      <Match when={isArray(props.port)}>
        <For each={props.port}>{(item) => <Item port={item} />}</For>
      </Match>
      <Match when={isObject(props.port)}>
        <Item port={props.port} />
      </Match>
    </Switch>
  );
}
