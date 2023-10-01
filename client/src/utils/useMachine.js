import { batch, onCleanup } from "solid-js";
import { createStore, reconcile } from "solid-js/store";
import { interpret } from "xstate";

export function useMachine(machine, options = {}) {
  const service = interpret(machine, options);

  const [state, setState] = createStore({
    ...service.initialState,
    matches(...args) {
      state.value;
      return service.state.matches(...args);
    },
  });

  service.onTransition((s) => {
    batch(() => {
      setState("value", s.value);
      setState("context", reconcile(s.context));
    });
  });

  service.start();
  onCleanup(() => service.stop());

  return [state, service.send];
}
