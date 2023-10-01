import { Loader } from "@googlemaps/js-api-loader";

export default function (libraries) {
  const loader = new Loader({
    apiKey: "AIzaSyCLYNnhHBiqFjP7iMGsbTMp18rg8uoD5mg",
    version: "weekly",
    libraries,
  });
  return { loader };
}
