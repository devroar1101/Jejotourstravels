import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-[100svh] place-items-center bg-paper px-6 text-center">
      <div>
        <p className="eyebrow mb-6">404</p>
        <h1 className="font-display text-display leading-none text-navy">
          Off the map
        </h1>
        <p className="mx-auto mt-6 max-w-md font-body text-navy-dim">
          The page you are looking for is not here. Let us point you back to the
          start of the journey.
        </p>
        <Link
          href="/"
          className="mt-10 inline-block bg-navy px-8 py-4 font-body text-sm uppercase tracking-wide text-paper transition-colors hover:bg-teal"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
