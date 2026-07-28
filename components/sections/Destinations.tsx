'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import CinematicVideo from '@/components/CinematicVideo';
import { Reveal } from '@/components/motion/Reveal';
import { destinations } from '@/content/destinations';
import { useIsTouch } from '@/lib/hooks';

const spanClass: Record<string, string> = {
  tall: 'md:row-span-2',
  wide: 'md:col-span-2',
  std: '',
};

export default function Destinations() {
  const touch = useIsTouch();
  // Never more than two videos decoding at once.
  const [active, setActive] = useState<string[]>([]);

  const activate = useCallback((name: string) => {
    setActive((cur) => {
      if (cur.includes(name)) return cur;
      return [name, ...cur].slice(0, 2);
    });
  }, []);
  const deactivate = useCallback((name: string) => {
    setActive((cur) => cur.filter((n) => n !== name));
  }, []);

  return (
    <section
      id="destinations"
      className="relative bg-paper px-6 py-28 md:px-12 md:py-40"
      aria-label="Destinations"
    >
      <div className="mx-auto max-w-editorial">
        <div className="mb-16 flex flex-col gap-6 md:mb-24 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-4">Destinations</p>
            <h2 className="font-display text-display-sm leading-none text-navy">
              Places we know well
            </h2>
          </div>
          <p className="max-w-sm font-body text-navy-dim">
            A short list, kept deliberately narrow. We would rather know a place
            than list it.
          </p>
        </div>

        <div className="grid auto-rows-[38vh] grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {destinations.map((d) => (
            <DestinationTile
              key={d.name}
              name={d.name}
              line={d.line}
              media={d.media}
              spanCls={spanClass[d.span]}
              touch={touch}
              active={active.includes(d.media)}
              onActivate={activate}
              onDeactivate={deactivate}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function DestinationTile({
  name,
  line,
  media,
  spanCls,
  touch,
  active,
  onActivate,
  onDeactivate,
}: {
  name: string;
  line: string;
  media: string;
  spanCls: string;
  touch: boolean;
  active: boolean;
  onActivate: (n: string) => void;
  onDeactivate: (n: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Mobile: activate when 60% in view.
  useEffect(() => {
    if (!touch) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e?.isIntersecting) onActivate(media);
        else onDeactivate(media);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [touch, media, onActivate, onDeactivate]);

  return (
    <Reveal
      as="div"
      className={`group relative overflow-hidden ${spanCls}`}
    >
      <div
        ref={ref}
        className="relative h-full w-full"
        onMouseEnter={touch ? undefined : () => onActivate(media)}
        onMouseLeave={touch ? undefined : () => onDeactivate(media)}
        data-cursor="VIEW"
      >
        <CinematicVideo
          name={media}
          label={`${name} — a place JEJO arranges journeys to`}
          width={1200}
          height={1400}
          mode="hover"
          active={active}
          scrim={0.5}
          className="absolute inset-0 h-full"
        />
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-end p-6">
          <h3 className="font-display text-3xl text-paper md:text-4xl">{name}</h3>
          {/* Line revealed on hover / in-view. */}
          <p
            className="mt-2 max-w-xs font-body text-sm text-paper-dim transition-all duration-500 ease-editorial md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
            style={touch && active ? { opacity: 1, transform: 'none' } : undefined}
          >
            {line}
          </p>
        </div>
      </div>
    </Reveal>
  );
}
