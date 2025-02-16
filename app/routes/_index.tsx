import type { MetaFunction } from "@remix-run/node";
import MapComponent from "~/components/map-component";
import { Analytics } from "@vercel/analytics/remix";
export const meta: MetaFunction = () => {
  return [
    { title: "OpenIndoorMaps" },
    {
      name: "description",
      content:
        "OpenIndoorMaps is a community-based tool that helps people navigate large indoor spaces like malls, airports, hospitals, and universities. Collaborate and add your building to help others find their way.",
    },
  ];
};

export default function Index() {
  return (
    <div className="flex h-svh items-center justify-center">
      <Analytics />

      <MapComponent />
    </div>
  );
}
