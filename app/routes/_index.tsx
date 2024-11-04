import type { MetaFunction } from '@remix-run/node';
import MapComponent from '~/components/map-component';

export const meta: MetaFunction = () => {
  return [
    { title: 'OpenIndoorMaps' },
    {
      name: 'description',
      content:
        'OpenIndoorMaps is a community-based tool that helps people navigate large indoor spaces like malls, airports, hospitals, and universities. Collaborate and add your building to help others find their way.',
    },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <MapComponent />
    </div>
  );
}
