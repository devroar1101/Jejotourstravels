'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  EnquiryDraft,
  STORAGE_KEY,
  draftFromSlug,
  emptyDraft,
} from '@/lib/enquiry';

interface EnquiryContextValue {
  open: boolean;
  step: number;
  draft: EnquiryDraft;
  openEnquiry: (slug?: string) => void;
  closeEnquiry: () => void;
  setStep: (n: number) => void;
  update: (patch: Partial<EnquiryDraft>) => void;
  reset: () => void;
}

const Ctx = createContext<EnquiryContextValue | null>(null);

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<EnquiryDraft>(emptyDraft);

  // Restore any in-progress draft from sessionStorage.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) setDraft({ ...emptyDraft, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  // Persist on every change.
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* ignore */
    }
  }, [draft]);

  const update = useCallback((patch: Partial<EnquiryDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
  }, []);

  const openEnquiry = useCallback((slug?: string) => {
    if (slug) {
      setDraft((d) => ({ ...d, ...draftFromSlug(slug) }));
      setStep(1); // deep-link opens at the month step
    }
    setOpen(true);
  }, []);

  const closeEnquiry = useCallback(() => setOpen(false), []);

  const reset = useCallback(() => {
    setDraft(emptyDraft);
    setStep(0);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // Deep link: /?enquire={slug}
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('enquire');
    if (slug) openEnquiry(slug);
  }, [openEnquiry]);

  const value = useMemo(
    () => ({ open, step, draft, openEnquiry, closeEnquiry, setStep, update, reset }),
    [open, step, draft, openEnquiry, closeEnquiry, update, reset],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEnquiry() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useEnquiry must be used within EnquiryProvider');
  return ctx;
}
