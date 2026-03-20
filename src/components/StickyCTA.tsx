import type { ReactNode } from 'react';

export function StickyCTA({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="h-24" />
      <div data-slot="sticky-cta" className="fixed bottom-0 left-0 right-0 z-30">
        <div className="bg-gradient-to-t from-background via-background to-transparent pt-6 pb-5 px-4">
          <div className="max-w-lg mx-auto">{children}</div>
        </div>
      </div>
    </>
  );
}
