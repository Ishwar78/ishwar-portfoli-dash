import { useEffect } from 'react';
import { usePortfolio } from '@/contexts/PortfolioContext';

const GRADIENT_CSS_VALUES: Record<string, { start: string; mid: string; end: string }> = {
  'blue-cyan': {
    start: '217 91% 60%',
    mid: '199 89% 48%',
    end: '186 100% 50%',
  },
  'purple-pink': {
    start: '270 91% 65%',
    mid: '322 80% 60%',
    end: '330 80% 55%',
  },
  'green-teal': {
    start: '142 76% 45%',
    mid: '168 75% 40%',
    end: '174 75% 40%',
  },
  'orange-red': {
    start: '25 95% 53%',
    mid: '15 90% 50%',
    end: '0 85% 55%',
  },
  'indigo-violet': {
    start: '239 84% 67%',
    mid: '258 90% 66%',
    end: '270 91% 65%',
  },
};

export function GradientProvider({ children }: { children: React.ReactNode }) {
  const { siteSettings } = usePortfolio();

  useEffect(() => {
    const preset = siteSettings.gradientPreset || 'blue-cyan';
    const values = GRADIENT_CSS_VALUES[preset] || GRADIENT_CSS_VALUES['blue-cyan'];

    document.documentElement.style.setProperty('--gradient-start', values.start);
    document.documentElement.style.setProperty('--gradient-mid', values.mid);
    document.documentElement.style.setProperty('--gradient-end', values.end);
  }, [siteSettings.gradientPreset]);

  return <>{children}</>;
}
