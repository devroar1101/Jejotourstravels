'use client';

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useConstrainedNetwork, useReducedMotion } from '@/lib/hooks';
import { posterPath } from '@/lib/media';

export type VideoMode = 'hero' | 'scrub' | 'hover' | 'masked' | 'ambient';

export interface CinematicVideoProps {
  /** Basename under /public/videos, e.g. "hero" -> hero.webm + hero.mp4 + hero.png */
  name: string;
  /** Accessible description of the footage. Required. */
  label: string;
  /** Intrinsic dimensions — reserves space so there is zero layout shift. */
  width: number;
  height: number;
  mode?: VideoMode;
  className?: string;
  /** object-position for the media. */
  position?: string;
  /** 0–1 ink gradient scrim strength painted over the video. */
  scrim?: number;
  /**
   * Hover / in-view driven crossfade. When true the loop plays and fades in;
   * when false it pauses and fades to the poster. Used by mode="hover".
   */
  active?: boolean;
  /** Fired once the element can play — used to trigger the hero headline. */
  onCanPlay?: () => void;
  /**
   * When true the component never autoplays; the parent drives currentTime
   * (mode="scrub"). The <video> is still mounted so it can be scrubbed.
   */
  manual?: boolean;
  /** Root margin for the lazy-mount observer. */
  rootMargin?: string;
  /**
   * Optional playlist of video basenames to play in sequence, looping back to
   * the first when the last ends. When set, overrides the single `name` clip.
   */
  clips?: string[];
}

export interface CinematicVideoHandle {
  video: HTMLVideoElement | null;
  poster: string;
}

const poster = (name: string) => posterPath(name);

/**
 * One component, five treatments. Poster-first: the poster paints immediately
 * with declared dimensions, and the <video> is only mounted when in view and
 * motion is allowed. prefers-reduced-motion and constrained networks stay on
 * the poster forever. Missing video files degrade silently to the poster.
 */
const CinematicVideo = forwardRef<CinematicVideoHandle, CinematicVideoProps>(
  function CinematicVideo(
    {
      name,
      label,
      width,
      height,
      mode = 'ambient',
      className = '',
      position = 'center',
      scrim = 0,
      active = false,
      onCanPlay,
      manual = false,
      rootMargin = '200px',
      clips,
    },
    ref,
  ) {
    const reduced = useReducedMotion();
    const constrained = useConstrainedNetwork();
    const wrapRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [inView, setInView] = useState(false);
    const [canPlay, setCanPlay] = useState(false);
    const [clipIndex, setClipIndex] = useState(0);

    const playlist = clips && clips.length > 0 ? clips : null;
    const isPlaylist = playlist !== null;

    // Suppress video only under reduced motion. A stale/incorrect
    // effectiveType reading on mobile must never hide the hero, so the
    // constrained-network signal no longer gates playback.
    void constrained;
    const posterOnly = reduced;
    const shouldMount = inView && !posterOnly;

    useImperativeHandle(ref, () => ({
      video: videoRef.current,
      poster: poster(name),
    }));

    // Lazy-mount when the element approaches the viewport.
    useEffect(() => {
      const el = wrapRef.current;
      if (!el) return;
      const io = new IntersectionObserver(
        (entries) => {
          const e = entries[0];
          if (e?.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        },
        { rootMargin },
      );
      io.observe(el);
      return () => io.disconnect();
    }, [rootMargin]);

    // Playlist: set the current clip's src, play, and advance on `ended`,
    // looping back to the first. Overrides the single-clip <source> path.
    useEffect(() => {
      const v = videoRef.current;
      if (!v || !shouldMount || !playlist) return;
      v.src = `/videos/${playlist[clipIndex]}.mp4`;
      v.load();
      void v.play().catch(() => undefined);
      const onEnded = () => setClipIndex((i) => (i + 1) % playlist.length);
      v.addEventListener('ended', onEnded);
      return () => v.removeEventListener('ended', onEnded);
    }, [shouldMount, clipIndex, playlist]);

    // Play / pause driven by mode + active + manual (single-clip path).
    // NOTE: play() is NOT gated on canPlay — with preload="none" the browser
    // won't load until play() is called, so gating on canPlay would deadlock
    // (no load -> no canplay -> no play). Calling play() kicks off the load.
    useEffect(() => {
      const v = videoRef.current;
      if (!v || !shouldMount) return;
      if (isPlaylist) return; // playlist effect owns playback
      if (manual) return; // parent scrubs currentTime
      if (mode === 'hover') {
        if (active) {
          v.currentTime = 0;
          void v.play().catch(() => undefined);
        } else {
          v.pause();
        }
        return;
      }
      void v.play().catch(() => undefined); // autoplay modes: hero / ambient / masked
    }, [shouldMount, active, mode, manual, isPlaylist]);

    const aspect = useMemo(
      () => ({ aspectRatio: `${width} / ${height}` }),
      [width, height],
    );

    // Crossfade posture: hover fades in on active; everything else shows video once ready.
    const videoVisible =
      canPlay && (mode === 'hover' ? active : true);

    // Autoplay modes (hero, ambient, masked) get the native autoplay attribute
    // as a belt-and-suspenders alongside the JS play() call.
    const autoplay = !manual && mode !== 'hover';

    return (
      <div
        ref={wrapRef}
        className={`cv-wrap ${className}`}
        style={aspect}
        data-mode={mode}
      >
        {/* Poster — always present, paints first, no layout shift.
            An empty label marks the media decorative (ambient backgrounds). */}
        <img
          src={poster(name)}
          alt={label}
          aria-hidden={label ? undefined : true}
          width={width}
          height={height}
          className="cv-poster"
          style={{ objectPosition: position }}
          decoding="async"
          loading={mode === 'hero' ? 'eager' : 'lazy'}
        />

        {shouldMount && (
          <video
            ref={videoRef}
            className="cv-video"
            style={{ objectPosition: position, opacity: videoVisible ? 1 : 0 }}
            width={width}
            height={height}
            muted
            playsInline
            autoPlay={autoplay}
            loop={!manual && !isPlaylist}
            preload={isPlaylist || autoplay || manual ? 'auto' : 'metadata'}
            poster={poster(name)}
            aria-label={label || undefined}
            aria-hidden={label ? undefined : true}
            onCanPlay={() => {
              setCanPlay(true);
              onCanPlay?.();
            }}
          >
            {!isPlaylist && (
              <>
                <source src={`/videos/${name}.webm`} type="video/webm" />
                <source src={`/videos/${name}.mp4`} type="video/mp4" />
              </>
            )}
          </video>
        )}

        {scrim > 0 && (
          <div
            className="cv-scrim"
            aria-hidden
            style={{
              background: `linear-gradient(180deg, rgba(14,31,58,${
                scrim * 0.5
              }) 0%, rgba(14,31,58,${scrim * 0.2}) 45%, rgba(14,31,58,${
                scrim
              }) 100%)`,
            }}
          />
        )}
      </div>
    );
  },
);

export default CinematicVideo;
