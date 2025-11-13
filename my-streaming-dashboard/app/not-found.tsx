import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-start gap-6 px-6 pb-24 md:px-12">
      <h1 className="text-4xl font-bold">Not found</h1>
      <p className="text-neutral-300">
        We couldn't find the page or movie you were looking for. It may have
        been removed or requires an updated data source.
      </p>
      <Link
        href="/"
        className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-neutral-900"
      >
        Return to dashboard
      </Link>
    </main>
  );
}

