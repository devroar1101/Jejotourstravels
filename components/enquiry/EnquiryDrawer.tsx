'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEnquiry } from './EnquiryContext';
import { packages, inr } from '@/content/packages';
import {
  budgetBands,
  buildMessage,
  isValidIndianMobile,
  months,
  telHref,
  whatsappHref,
} from '@/lib/enquiry';
import { useReducedMotion } from '@/lib/hooks';

const TOTAL_STEPS = 5; // destination, month, travellers, budget, details

const ease = [0.16, 1, 0.3, 1] as const;

export default function EnquiryDrawer() {
  const { open, step, draft, closeEnquiry, setStep, update } = useEnquiry();
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const [blocked, setBlocked] = useState(false);
  const [copied, setCopied] = useState(false);
  // "Somewhere else" reveals a free-text destination field.
  const [custom, setCustom] = useState(
    () => draft.slug === null && draft.destination.trim().length > 0,
  );

  const message = buildMessage(draft);
  const atReview = step >= TOTAL_STEPS;

  // Lock body scroll + focus management + Esc.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeEnquiry();
    };
    document.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>(
        'button, input, [tabindex]',
      )?.focus();
    }, 60);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
    };
  }, [open, step, closeEnquiry]);

  const canAdvance = (): boolean => {
    switch (step) {
      case 0:
        return Boolean(draft.destination);
      case 1:
        return Boolean(draft.month);
      case 2:
        return draft.adults >= 1;
      case 3:
        return Boolean(draft.budget);
      case 4:
        return draft.name.trim().length > 1 && isValidIndianMobile(draft.phone);
      default:
        return true;
    }
  };

  const next = () => {
    if (!canAdvance()) return;
    setStep(Math.min(step + 1, TOTAL_STEPS));
  };
  const back = () => setStep(Math.max(step - 1, 0));

  const handleSend = () => {
    const href = whatsappHref(message);
    const win = window.open(href, '_blank', 'noopener');
    if (!win) setBlocked(true); // iOS in-app browsers block this
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setBlocked(true);
    }
  };

  const progress = Math.min(step, TOTAL_STEPS) / TOTAL_STEPS;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Scrim */}
          <button
            aria-label="Close enquiry"
            onClick={closeEnquiry}
            className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Plan your journey with JEJO Tours and Travels"
            className="absolute right-0 top-0 flex h-full w-full max-w-[30rem] flex-col bg-paper-2 shadow-2xl"
            initial={reduced ? { opacity: 0 } : { x: '100%' }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: 0.5, ease }}
          >
            {/* Header + progress */}
            <div className="flex items-center justify-between px-7 pt-7">
              <span className="eyebrow">Plan a journey</span>
              <button
                onClick={closeEnquiry}
                className="text-navy-dim transition-colors hover:text-navy"
                aria-label="Close"
              >
                Close
              </button>
            </div>
            <div className="mt-5 h-px w-full bg-navy-faint">
              <motion.div
                className="h-px bg-teal"
                animate={{ scaleX: atReview ? 1 : progress }}
                style={{ transformOrigin: 'left', width: '100%' }}
                transition={{ duration: 0.5, ease }}
              />
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-7 py-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease }}
                >
                  {step < TOTAL_STEPS && (
                    <p className="mb-1 font-body text-sm text-navy-dim">
                      Question {step + 1} of {TOTAL_STEPS}
                    </p>
                  )}

                  {/* Step 0 — Destination */}
                  {step === 0 && (
                    <Fieldset title="Where would you like to go?">
                      <div className="flex flex-wrap gap-2">
                        {packages.map((p) => (
                          <Chip
                            key={p.slug}
                            active={draft.slug === p.slug}
                            onClick={() => {
                              setCustom(false);
                              update({
                                destination: p.name,
                                slug: p.slug,
                                price: p.price ? `${inr(p.price)} onwards` : '',
                              });
                            }}
                          >
                            {p.name}
                          </Chip>
                        ))}
                        <Chip
                          active={custom}
                          onClick={() => {
                            setCustom(true);
                            update({
                              destination: 'Somewhere else',
                              slug: null,
                              price: '',
                            });
                          }}
                        >
                          Somewhere else
                        </Chip>
                      </div>

                      {custom && (
                        <label className="mt-6 block">
                          <span className="mb-2 block font-body text-sm text-navy-dim">
                            Where to?
                          </span>
                          <input
                            type="text"
                            autoFocus
                            value={
                              draft.destination === 'Somewhere else'
                                ? ''
                                : draft.destination
                            }
                            onChange={(e) => {
                              const v = e.target.value;
                              update({
                                destination: v.trim() ? v : 'Somewhere else',
                                slug: null,
                                price: '',
                              });
                            }}
                            className="w-full border-b border-navy-faint bg-transparent py-3 font-display text-2xl text-navy outline-none transition-colors focus:border-teal"
                            placeholder="City, country or region"
                          />
                        </label>
                      )}
                    </Fieldset>
                  )}

                  {/* Step 1 — Month */}
                  {step === 1 && (
                    <Fieldset title="Which month?">
                      <div className="grid grid-cols-3 gap-2">
                        {months.map((m) => (
                          <Chip
                            key={m}
                            active={draft.month === m}
                            onClick={() => update({ month: m })}
                          >
                            {m.slice(0, 3)}
                          </Chip>
                        ))}
                      </div>
                    </Fieldset>
                  )}

                  {/* Step 2 — Travellers */}
                  {step === 2 && (
                    <Fieldset title="Who is travelling?">
                      <Stepper
                        label="Adults"
                        value={draft.adults}
                        min={1}
                        onChange={(v) => update({ adults: v })}
                      />
                      <Stepper
                        label="Children"
                        value={draft.children}
                        min={0}
                        onChange={(v) => update({ children: v })}
                      />
                      <Stepper
                        label="Infants"
                        value={draft.infants}
                        min={0}
                        onChange={(v) => update({ infants: v })}
                      />
                    </Fieldset>
                  )}

                  {/* Step 3 — Budget */}
                  {step === 3 && (
                    <Fieldset title="Budget per person">
                      <div className="flex flex-col gap-2">
                        {budgetBands.map((b) => (
                          <Chip
                            key={b}
                            wide
                            active={draft.budget === b}
                            onClick={() => update({ budget: b })}
                          >
                            {b}
                          </Chip>
                        ))}
                      </div>
                    </Fieldset>
                  )}

                  {/* Step 4 — Details */}
                  {step === 4 && (
                    <Fieldset title="Your details">
                      <label className="block">
                        <span className="mb-2 block font-body text-sm text-navy-dim">
                          Name
                        </span>
                        <input
                          type="text"
                          value={draft.name}
                          onChange={(e) => update({ name: e.target.value })}
                          className="w-full border-b border-navy-faint bg-transparent py-3 font-display text-2xl text-navy outline-none transition-colors focus:border-teal"
                          placeholder="Full name"
                          autoComplete="name"
                        />
                      </label>
                      <label className="mt-6 block">
                        <span className="mb-2 block font-body text-sm text-navy-dim">
                          Mobile (10 digits)
                        </span>
                        <div className="flex items-baseline gap-2 border-b border-navy-faint focus-within:border-teal">
                          <span className="font-display text-2xl text-navy-dim">
                            +91
                          </span>
                          <input
                            type="tel"
                            inputMode="numeric"
                            value={draft.phone}
                            onChange={(e) =>
                              update({
                                phone: e.target.value.replace(/\D/g, '').slice(0, 10),
                              })
                            }
                            className="w-full bg-transparent py-3 font-display text-2xl text-navy outline-none"
                            placeholder="98765 43210"
                            autoComplete="tel-national"
                            aria-invalid={
                              draft.phone.length > 0 &&
                              !isValidIndianMobile(draft.phone)
                            }
                          />
                        </div>
                        {draft.phone.length > 0 &&
                          !isValidIndianMobile(draft.phone) && (
                            <span className="mt-2 block font-body text-xs text-teal">
                              Enter a valid 10-digit Indian mobile number.
                            </span>
                          )}
                      </label>
                    </Fieldset>
                  )}

                  {/* Review */}
                  {atReview && (
                    <div>
                      <h2 className="font-display text-display-sm leading-none text-navy">
                        Ready to send
                      </h2>
                      <p className="mt-4 font-body text-navy-dim">
                        Your enquiry opens in WhatsApp. Nothing is stored on a
                        server.
                      </p>
                      <pre className="mt-6 whitespace-pre-wrap rounded-sm border border-navy-faint bg-navy-soft p-4 font-body text-sm text-navy-dim">
                        {message}
                      </pre>

                      <button
                        onClick={handleSend}
                        data-cursor="OPEN"
                        className="mt-6 w-full bg-teal py-4 font-body text-sm uppercase tracking-wide text-paper transition-transform hover:-translate-y-0.5"
                      >
                        Send on WhatsApp
                      </button>

                      {/* Fallback chain for blocked pop-ups (iOS in-app browsers) */}
                      {blocked && (
                        <div className="mt-4 space-y-3 border-t border-navy-faint pt-4">
                          <p className="font-body text-xs text-navy-dim">
                            If WhatsApp did not open, use one of these:
                          </p>
                          <a
                            href={whatsappHref(message)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block border border-teal py-3 text-center font-body text-sm text-teal"
                          >
                            Open WhatsApp
                          </a>
                          <button
                            onClick={copy}
                            className="block w-full border border-navy-faint py-3 text-center font-body text-sm text-navy"
                          >
                            {copied ? 'Copied' : 'Copy enquiry'}
                          </button>
                          <a
                            href={telHref}
                            className="block border border-navy-faint py-3 text-center font-body text-sm text-navy"
                          >
                            Call {`+91 86105 80975`}
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer nav */}
            {!atReview && (
              <div className="flex items-center justify-between gap-4 border-t border-navy-faint px-7 py-5">
                <button
                  onClick={back}
                  disabled={step === 0}
                  className="font-body text-sm text-navy-dim transition-colors hover:text-navy disabled:opacity-30"
                >
                  Back
                </button>
                <button
                  onClick={next}
                  disabled={!canAdvance()}
                  data-cursor="NEXT"
                  className="bg-navy px-8 py-3 font-body text-sm uppercase tracking-wide text-paper transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
                >
                  {step === TOTAL_STEPS - 1 ? 'Review' : 'Next'}
                </button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Fieldset({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="mb-6 font-display text-display-sm leading-none text-navy">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Chip({
  children,
  active,
  onClick,
  wide = false,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`${wide ? 'w-full text-left' : ''} border px-4 py-3 font-body text-sm transition-colors ${
        active
          ? 'border-teal bg-teal/10 text-navy'
          : 'border-navy-faint text-navy-dim hover:border-navy hover:text-navy'
      }`}
    >
      {children}
    </button>
  );
}

function Stepper({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between border-b border-navy-faint py-4">
      <span className="font-display text-2xl text-navy">{label}</span>
      <div className="flex items-center gap-5">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="grid h-9 w-9 place-items-center rounded-full border border-navy-faint text-navy transition-colors hover:border-teal"
        >
          −
        </button>
        <span className="w-6 text-center font-display text-2xl tabular-nums text-navy">
          {value}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onChange(value + 1)}
          className="grid h-9 w-9 place-items-center rounded-full border border-navy-faint text-navy transition-colors hover:border-teal"
        >
          +
        </button>
      </div>
    </div>
  );
}
