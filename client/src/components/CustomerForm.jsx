import createGmapsLoader from "../utils/createGmapsLoader.js";
import { reporter, ValidationMessage } from "@felte/reporter-solid";
import { createForm } from "@felte/solid";
import { validator } from "@felte/validator-yup";
import axios from "axios";
import { debounce } from "lodash/function.js";
import { createEffect, onCleanup } from "solid-js";
import { createTurboResource } from "turbo-solid";
import * as yup from "yup";

// validation
const schema = yup.object({
  customer_name: yup.string("Customer Name must be a string"),
  telephone: yup
    .string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      "Phone number is not valid"
    ),
  contact_person: yup
    .string()
    .email(
      "Contact Person must be a valid email address e.g. someone@example.com"
    ),
  website_url: yup.string().url("Must be a valid url e.g. https://example.com"),
  customer_location: yup.string("Location must be a string"),
});

// form component
export default function CustomerForm() {
  // set up form
  const { form, data, setFields, errors, interacted } = createForm({
    extend: [validator({ schema }), reporter],
  });
  // load api data
  const [customer, { mutate }] = createTurboResource(() => "/api/customer");

  // location input for Google
  let locationInput;
  const { loader } = createGmapsLoader(["places"]);

  // load gmaps
  loader.load().then(() => {
    let autocomplete = new google.maps.places.Autocomplete(locationInput, {
      componentRestrictions: { country: "us" },
      fields: ["address_components", "geometry", "icon", "name"],
      strictBounds: false,
    });
    autocomplete.addListener("place_changed", () => {
      const event = {};
      event.target = {
        name: "customer_location",
        value: locationInput.value,
      };
      onInput(event);
      setFields("customer_location", locationInput.value);
    });
    onCleanup(() => autocomplete.removeListener("place_changed"));
  });

  // auto-save on input change
  const onInput = debounce(async (event) => {
    if (errors()[event.target.name] === null) {
      await axios.patch("/api/customer", {
        [event.target.name]: event.target.value,
      });
      await mutate({
        ...customer(),
        value: {
          ...customer().value,
          [event.target.name]: event.target.value,
        },
      });
    }
  }, 500);

  createEffect(() => {
    if (customer() && customer().hasOwnProperty("value")) {
      setFields(customer().value);
    }
  }, customer());

  return (
    <form class="flex flex-col gap-y-3" use:form>
      <div>
        <label class="block" for="customer_name">
          Customer Name
        </label>
        <input
          id="customer_name"
          type="text"
          class="form-input"
          name="customer_name"
          autocomplete="off"
          role="presentation"
          placeholder="Example, inc."
          onInput={onInput}
        />
        <ValidationMessage for="customer_name">
          {(message) => <div class="text-xs text-red-500">{message?.[0]}</div>}
        </ValidationMessage>
      </div>
      <div>
        <label class="block" for="customer_location">
          Customer Location
        </label>
        <input
          ref={locationInput}
          id="customer_location"
          type="text"
          class="form-input"
          name="customer_location"
          onFocus={(e) => e.currentTarget.setAttribute("autocomplete", `off`)}
          placeholder="404 Not Found Rd, Springfield, AW"
          role="presentation"
        />
        <ValidationMessage for="customer_location">
          {(message) => <div class="text-xs text-red-500">{message?.[0]}</div>}
        </ValidationMessage>
      </div>
      <div>
        <label class="block" for="telephone">
          Telephone
        </label>
        <input
          id="telephone"
          type="text"
          class="form-input"
          name="telephone"
          autocomplete="off"
          role="presentation"
          placeholder="202-555-0190"
          onInput={onInput}
        />
        <ValidationMessage for="telephone">
          {(message) => <div class="text-xs text-red-500">{message?.[0]}</div>}
        </ValidationMessage>
      </div>
      <div>
        <label class="block" for="contact_person">
          Contact Person
        </label>
        <input
          id="contact_person"
          placeholder="person@example.com"
          type="text"
          class="form-input"
          name="contact_person"
          autocomplete="off"
          role="presentation"
          onInput={onInput}
        />
        <ValidationMessage for="contact_person">
          {(message) => <div class="text-xs text-red-500">{message?.[0]}</div>}
        </ValidationMessage>
      </div>
      <div>
        <label class="block" for="website_url">
          Website
        </label>
        <input
          id="website_url"
          type="text"
          class="form-input"
          name="website_url"
          autocomplete="off"
          role="presentation"
          placeholder="https://example.com"
          onInput={onInput}
        />
        <ValidationMessage for="website_url">
          {(message) => <div class="text-xs text-red-500">{message?.[0]}</div>}
        </ValidationMessage>
      </div>
      {/*<div class="flex justify-end">*/}
      {/*  <button class="button primary" type="submit">*/}
      {/*    Submit*/}
      {/*  </button>*/}
      {/*</div>*/}
    </form>
  );
}
