import CustomerForm from "../components/CustomerForm.jsx";
import ISPForm from "../components/ISPForm.jsx";
import { createStore } from "solid-js/store";

const [state, setState] = createStore({
  isp: [{ name: "" }],
});

export default function OnBoarding() {
  return (
    <div class="container mx-auto">
      <h1 class="text-2xl mt-8 mb-4">On Boarding</h1>
      <div class="grid gap-16 grid-cols-4 mb-6">
        <div class="col-span-3 flex flex-col gap-y-6">
          <section id="customer">
            <h2 class="text-3xl leading-loose">Customer Information</h2>
            <CustomerForm />
          </section>
          <section id="isp">
            <h2 class="text-3xl leading-loose">ISP Information</h2>
            <ISPForm />
          </section>
        </div>
        <div>
          <ul>
            <li>Link</li>
            <li>Link</li>
            <li>Link</li>
            <li>Link</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
