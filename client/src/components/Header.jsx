import ModeToggle from "./ModeToggle.jsx";
import InterfaceMenu from "./InterfaceMenu.jsx";
import Menu from "./Menu.jsx";

export default function Header() {
  return (
    <header class="border-b border-slate-200 bg-slate-100 py-4 dark:border-slate-700 dark:bg-slate-800">
      <div class="container mx-auto flex items-center">
        <div class="text-2xl font-semibold font-heading">
          <span class="font-bold text-blue-600">BDK</span>
          <span>inc</span>
        </div>
        <div class="px-6">
          <Menu />
        </div>
        <div class="ml-auto flex items-center">
          <div class="mr-4">
            <InterfaceMenu />
          </div>
          <div>
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
