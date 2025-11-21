import Link from "next/link";
import { redirect } from "next/navigation";

import { getSession } from "~/server/better-auth/server";

export default async function StudioPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

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
              <Link className="text-white" href="/studio">
                Studio
              </Link>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-4">
              <span className="text-slate-300">
                {session.user?.name ?? session.user?.email}
              </span>
              <Link
                className="rounded-lg bg-slate-700 px-4 py-2 text-white transition hover:bg-slate-600"
                href="/login"
              >
                Sign out
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1">
        <aside className="w-64 border-slate-700 border-r bg-slate-900/50 p-4">
          <h2 className="mb-4 font-semibold text-white">Tools</h2>
          <div className="space-y-2">
            <button
              className="w-full rounded-lg bg-slate-800 px-4 py-2 text-left text-slate-300 transition hover:bg-slate-700"
              type="button"
            >
              New Map
            </button>
            <button
              className="w-full rounded-lg bg-slate-800 px-4 py-2 text-left text-slate-300 transition hover:bg-slate-700"
              type="button"
            >
              Import
            </button>
            <button
              className="w-full rounded-lg bg-slate-800 px-4 py-2 text-left text-slate-300 transition hover:bg-slate-700"
              type="button"
            >
              My Maps
            </button>
          </div>
        </aside>

        <div className="flex flex-1 items-center justify-center p-8">
          <div className="w-full max-w-6xl">
            <h2 className="mb-4 font-bold text-3xl text-white">Map Studio</h2>
            <p className="mb-8 text-slate-300">
              Create and edit indoor maps with our powerful editor
            </p>
            <div className="aspect-video w-full rounded-lg border-2 border-slate-700 bg-slate-800/50 p-8">
              <div className="flex h-full items-center justify-center text-slate-400">
                <div>
                  <svg
                    aria-label="Edit icon"
                    className="mx-auto mb-4 size-16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <title>Edit</title>
                    <path
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="text-lg">Map Editor Placeholder</p>
                  <p className="mt-2 text-sm">
                    Indoor map editing tools will be displayed here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
