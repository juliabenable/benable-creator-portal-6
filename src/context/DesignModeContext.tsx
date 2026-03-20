import { createContext, useContext, useState, type ReactNode } from 'react';

type DesignMode = 'figma' | 'refined';

interface DesignModeContextType {
  mode: DesignMode;
  setMode: (mode: DesignMode) => void;
  isRefined: boolean;
}

const DesignModeContext = createContext<DesignModeContextType | null>(null);

export function DesignModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<DesignMode>('figma');

  return (
    <DesignModeContext.Provider value={{ mode, setMode, isRefined: mode === 'refined' }}>
      {children}
    </DesignModeContext.Provider>
  );
}

export function useDesignMode() {
  const ctx = useContext(DesignModeContext);
  if (!ctx) throw new Error('useDesignMode must be used within DesignModeProvider');
  return ctx;
}
