import Link from "next/link";

import { getSession } from "~/server/better-auth/server";

export default async function Home() {
  const session = await getSession();

  return (
    <main className="flex min-h-screen flex-col bg-linear-to-b from-slate-900 to-slate-800">
      <nav className="border-slate-700 border-b bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-8">
            <h1 className="font-bold text-2xl text-white">OpenIndoorMaps</h1>
            <div className="flex gap-4">
              <Link
                className="text-slate-300 transition hover:text-white"
                href="/"
              >
                Map
              </Link>
              {session && (
                <Link
                  className="text-slate-300 transition hover:text-white"
                  href={"/studio" as never}
                >
                  Studio
                </Link>
              )}
            </div>
          </div>
          <div>
            {session ? (
              <div className="flex items-center gap-4">
                <span className="text-slate-300">
                  {session.user?.name ?? session.user?.email}
                </span>
                <Link
                  className="rounded-lg bg-slate-700 px-4 py-2 text-white transition hover:bg-slate-600"
                  href={"/login" as never}
                >
                  Sign out
                </Link>
              </div>
            ) : (
              <Link
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-500"
                href={"/login" as never}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="flex flex-1 items-center justify-center">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="mb-4 font-bold text-5xl text-white">
            Indoor Mapping Platform
          </h2>
          <p className="mb-8 text-slate-300 text-xl">
            Create, view, and share indoor maps for buildings and venues
          </p>
          <div className="mx-auto aspect-video max-w-4xl rounded-lg border-2 border-slate-700 bg-slate-800/50 p-8">
            <div className="flex h-full items-center justify-center text-slate-400">
              <div>
                <svg
                  aria-label="Map icon"
                  className="mx-auto mb-4 size-16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <title>Map</title>
                  <path
                    d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-lg">Map Viewer Placeholder</p>
                <p className="mt-2 text-sm">
                  Interactive indoor map will be displayed here
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
