export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans dark:bg-zinc-950">
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6">
        {/* Hero */}
        <section className="flex flex-col items-center gap-6 pb-20 pt-24 text-center sm:pt-32">
          <span className="inline-flex items-center rounded-full bg-green-50 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-green-700">
            Open Source
          </span>

          <h1 className="max-w-3xl text-balance text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">
            Indoor navigation,
            <br />
            open for everyone.
          </h1>

          <p className="max-w-xl text-balance text-lg leading-relaxed text-zinc-500">
            OpenIndoorMaps is an open platform for creating and using 3D indoor maps with integrated
            navigation – for universities, schools, shopping centers, and more.
          </p>

          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <a
              href="https://github.com/openindoormaps"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center rounded-lg bg-green-600 px-6 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              View on GitHub
            </a>
            <a
              href="#features"
              className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-200 px-6 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
            >
              Learn more
            </a>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="grid grid-cols-1 gap-5 pb-24 sm:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-8">
            <span className="text-3xl">🗺️</span>
            <h2 className="text-base font-semibold text-zinc-900">Map Creation Studio</h2>
            <p className="text-sm leading-relaxed text-zinc-500">
              Visual browser-based editor for drawing rooms and corridors. Drag & drop room
              creation, auto path generation, and CAD/PDF import – no GIS knowledge required.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-8">
            <span className="text-3xl">🏢</span>
            <h2 className="text-base font-semibold text-zinc-900">3D Visualization & Navigation</h2>
            <p className="text-sm leading-relaxed text-zinc-500">
              Real-time 3D rendering with MapLibre GL, multi-floor support, A* routing, step-by-step
              navigation, accessible routing options, and PWA offline support.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-8">
            <span className="text-3xl">📊</span>
            <h2 className="text-base font-semibold text-zinc-900">Intelligent Data Schema</h2>
            <p className="text-sm leading-relaxed text-zinc-500">
              Generic JSON schema for any building type, plugin-based custom fields, automatic
              validation, and a category system for classrooms, offices, shops, and more.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-zinc-100 bg-zinc-50 p-8">
            <span className="text-3xl">📱</span>
            <h2 className="text-base font-semibold text-zinc-900">Multi-Platform Support</h2>
            <p className="text-sm leading-relaxed text-zinc-500">
              Progressive Web App, React Native mobile apps, embeddable iframe for websites, public
              display mode, and full screen reader accessibility.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
