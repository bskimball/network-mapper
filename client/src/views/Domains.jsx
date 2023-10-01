import DomainForm from "../components/DomainForm.jsx";
import DomainsList from "../components/DomainsList.jsx";
import DomainCards from "../components/DomainCards.jsx";

export default function Configuration() {
  return (
    <div class="container mx-auto">
      <h1 class="text-2xl mt-8 mb-4">Domains</h1>
      <div class="flex gap-x-16">
        <div>
          <div class="mb-16">
            <DomainForm />
          </div>
          <div>
            <DomainsList />
          </div>
        </div>
        <div class="flex-1">
          <DomainCards />
        </div>
      </div>
    </div>
  );
}
