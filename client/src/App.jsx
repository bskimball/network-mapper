import Header from "./components/Header.jsx";
import Configuration from "./views/Configuration.jsx";
import Domains from "./views/Domains.jsx";
import Home from "./views/Home.jsx";
import LANNetwork from "./views/LANNetwork.jsx";
import OnBoarding from "./views/OnBoarding.jsx";
import { Route, Routes } from "@solidjs/router";
import axios from "axios";
import { configure } from "turbo-solid";

configure({
  async fetcher(key) {
    const { data } = await axios.get(key);
    return data;
  },
});

export default function App() {
  return (
    <div class="wrapper">
      <Header />
      <Routes>
        <Route path="/" component={Home} />
        <Route path="/configuration" component={Configuration} />
        <Route path="/domains" component={Domains} />
        <Route path="/lan" component={LANNetwork} />
        <Route path="/on-boarding" component={OnBoarding} />
      </Routes>
    </div>
  );
}
