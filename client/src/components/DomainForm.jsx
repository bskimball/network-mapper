import { reporter, ValidationMessage } from "@felte/reporter-solid";
import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-yup";
import axios from "axios";
import { createTurboResource } from "turbo-solid";
import * as yup from "yup";

const schema = yup.object({
  name: yup
    .string()
    .matches(
      "^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\\.(xn--)?([a-z0-9\\-]{1,61}|[a-z0-9-]{1,30}\\.[a-z]{2,})$",
      "must be a valid domain name"
    )
    .required(),
});

export default function DomainForm() {
  let input;
  const [domains, { mutate }] = createTurboResource(() => "/api/domains");

  const { form } = createForm({
    extend: [validator({ schema }), reporter],
    onSubmit: async (values) => {
      const { data } = await axios.post("/api/domains", values);
      mutate([...domains(), data]);
      input.value = "";
    },
  });

  return (
    <form use:form>
      <div class="mb-3">
        <input
          class="form-input"
          type="text"
          name="name"
          autocomplete="off"
          ref={input}
        />
        <ValidationMessage for="name">
          {(message) => <div class="text-xs text-red-500">{message?.[0]}</div>}
        </ValidationMessage>
      </div>
      <button class="button primary" type="submit">
        Add Domain
      </button>
    </form>
  );
}
