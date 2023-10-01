import { reporter } from "@felte/reporter-solid";
import { createForm } from "@felte/solid";

export default function OnBoardingForm() {
  const { form } = createForm({
    extend: [reporter],
    onSubmit: async (values) => {
      console.log({ values });
    },
  });

  return (
    <form use:form>
      <div class="mb-3"></div>
    </form>
  );
}
