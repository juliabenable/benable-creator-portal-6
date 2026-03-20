import { Monitor, Smartphone } from 'lucide-react';

type ViewportMode = 'mobile' | 'desktop';

interface ViewportToggleProps {
  mode: ViewportMode;
  onModeChange: (mode: ViewportMode) => void;
}

export function ViewportToggle({ mode, onModeChange }: ViewportToggleProps) {
  return (
    <div className="viewport-toggle">
      <button
        className={mode === 'mobile' ? 'active' : ''}
        onClick={() => onModeChange('mobile')}
      >
        <Smartphone className="w-4 h-4" />
        Mobile
      </button>
      <button
        className={mode === 'desktop' ? 'active' : ''}
        onClick={() => onModeChange('desktop')}
      >
        <Monitor className="w-4 h-4" />
        Desktop
      </button>
    </div>
  );
}
