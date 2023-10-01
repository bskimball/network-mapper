import LANInfo from "../components/LANInfo.jsx";
import IPInfo from "../components/IPInfo.jsx";

export default function Home() {
  return (
    <div class="container mx-auto">
      <h1 class="text-2xl mb-4 mt-8">Dashboard</h1>
      <div class="mb-3">
        <IPInfo />
      </div>
      <div class="mb-3">
        <LANInfo />
      </div>
    </div>
  );
}
