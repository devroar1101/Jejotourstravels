import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { trips, tripBySlug } from '@/content/catalog';
import { inr } from '@/content/packages';
import { site } from '@/content/site';
import { posterPath } from '@/lib/media';
import EnquiryCTA from '@/components/enquiry/EnquiryCTA';
import Footer from '@/components/sections/Footer';
import { whatsappHref, buildMessage, emptyDraft } from '@/lib/enquiry';

export function generateStaticParams() {
  return trips.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const trip = tripBySlug(params.slug);
  if (!trip) return {};
  const image =
    trip.category === 'international'
      ? `/og/${trip.media}.png`
      : posterPath(trip.media);
  return {
    title: trip.name,
    description: trip.summary,
    alternates: { canonical: `/destinations/${trip.slug}/` },
    openGraph: {
      title: `${trip.name} · ${site.name}`,
      description: trip.summary,
      url: `${site.url}/destinations/${trip.slug}/`,
      images: [{ url: image, width: 1200, height: 630, alt: trip.name }],
    },
  };
}

export default function DestinationPage({
  params,
}: {
  params: { slug: string };
}) {
  const trip = tripBySlug(params.slug);
  if (!trip) notFound();

  const kicker = trip.category === 'domestic' ? 'Within India' : 'International';
  // A few other journeys from the same family for the footer strip.
  const more = trips
    .filter((t) => t.category === trip.category && t.slug !== trip.slug)
    .slice(0, 4);

  const waHref = whatsappHref(
    buildMessage({
      ...emptyDraft,
      destination: trip.name,
      slug: trip.slug,
      price: trip.price ? `${inr(trip.price)} onwards` : '',
    }),
  );

  return (
    <main className="bg-paper">
      {/* Slim static header */}
      <header className="fixed inset-x-0 top-0 z-50 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-editorial items-center justify-between px-6 py-4 md:px-12">
          <Link href="/" className="flex items-center gap-3" aria-label="JEJO Tours and Travels — home">
            <img src="/logo-mark.png" alt="JEJO Tours &amp; Travels" className="h-9 w-auto" />
            <span className="flex flex-col leading-none text-navy">
              <span className="font-display text-lg font-semibold leading-none tracking-tight">
                JEJO
              </span>
              <span className="mt-1 font-body text-[0.5rem] uppercase leading-none tracking-[0.28em] opacity-80">
                Tours &amp; Travels
              </span>
            </span>
          </Link>
          <Link
            href="/#destinations"
            className="link-underline font-body text-sm text-navy-dim hover:text-navy"
          >
            All journeys
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[72svh] min-h-[520px] w-full overflow-hidden">
        <img
          src={posterPath(trip.media)}
          alt={trip.name}
          className="absolute inset-0 h-full w-full object-cover"
          width={1200}
          height={1500}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(10,14,24,0.9) 0%, rgba(10,14,24,0.35) 45%, rgba(10,14,24,0.15) 100%)',
          }}
        />
        <div className="absolute inset-0 z-10 mx-auto flex max-w-editorial flex-col justify-end px-6 pb-12 md:px-12 md:pb-16">
          <p className="eyebrow mb-3" style={{ color: 'var(--teal)' }}>
            {kicker} · {trip.region}
          </p>
          <h1 className="font-display text-display-sm leading-none text-paper md:text-display">
            {trip.name}
          </h1>
          {trip.duration && (
            <p className="mt-4 font-body text-paper-dim">{trip.duration}</p>
          )}
        </div>
      </section>

      {/* Body */}
      <section className="mx-auto max-w-editorial px-6 py-20 md:px-12 md:py-28">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="font-display text-2xl leading-snug text-navy md:text-3xl">
              {trip.summary}
            </p>

            <h2 className="eyebrow mb-6 mt-16">What the route includes</h2>
            <ul className="space-y-4">
              {trip.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-baseline gap-4 border-b border-navy-faint pb-4 font-body text-navy-dim"
                >
                  <span
                    aria-hidden
                    className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: 'var(--teal)' }}
                  />
                  <span className="text-navy">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sticky enquiry card */}
          <div className="md:col-span-4 md:col-start-9">
            <div className="sticky top-28 border border-navy-faint bg-paper-2 p-8">
              <p className="eyebrow mb-2">From</p>
              <p className="font-display text-4xl text-navy">
                {trip.price ? (
                  <>
                    {inr(trip.price)}
                    <span className="ml-2 font-body text-sm text-navy-dim">
                      / person
                    </span>
                  </>
                ) : (
                  <span className="text-3xl">Price on request</span>
                )}
              </p>
              <p className="mt-4 font-body text-sm text-navy-dim">
                Dates, group size and inclusions shape the final quote. Tell us
                what you have in mind and we will plan the rest.
              </p>
              <div className="mt-8 flex flex-col gap-4">
                <EnquiryCTA slug={trip.slug} variant="solid">
                  Plan this trip
                </EnquiryCTA>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline font-body text-sm text-teal"
                >
                  Or message us on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* More journeys */}
        {more.length > 0 && (
          <div className="mt-28">
            <h2 className="eyebrow mb-8">More {kicker.toLowerCase()} journeys</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {more.map((m) => (
                <Link
                  key={m.slug}
                  href={`/destinations/${m.slug}/`}
                  className="group relative aspect-[3/4] overflow-hidden"
                  data-cursor="VIEW"
                >
                  <img
                    src={posterPath(m.media)}
                    alt={m.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
                    width={1000}
                    height={1333}
                    loading="lazy"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to top, rgba(10,14,24,0.85) 0%, rgba(10,14,24,0) 60%)',
                    }}
                  />
                  <h3 className="absolute inset-x-0 bottom-0 z-10 p-4 font-display text-xl text-paper">
                    {m.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
