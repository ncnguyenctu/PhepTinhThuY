import { useEffect, useRef } from 'react';
import katex from 'katex';

interface KaTeXFormulaProps {
  formula: string;
  displayMode?: boolean;
  className?: string;
}

export default function KaTeXFormula({ formula, displayMode = false, className = '' }: KaTeXFormulaProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      try {
        katex.render(formula, ref.current, {
          displayMode,
          throwOnError: false,
          errorColor: '#dc2626',
          macros: {
            '\\R': '\\mathbb{R}',
          },
        });
      } catch (e) {
        if (ref.current) ref.current.textContent = formula;
      }
    }
  }, [formula, displayMode]);

  return <span ref={ref} className={className} />;
}
