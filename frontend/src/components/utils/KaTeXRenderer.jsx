import React, { useEffect, useRef } from 'react';
import katex from 'katex';

/**
 * Robust LaTeX sanitizer that fixes common AI-generated formatting glitches:
 * - Accidental double subscripts like a_n_b_n -> a_n b_n
 * - Double subscripts like x_1_2 -> x_{1,2}
 * - Enclosing $, $$, \[, \]
 * - Markdown fences
 * - Unescaped % characters
 */
export const sanitizeLatex = (str) => {
  if (!str || typeof str !== 'string') return '';
  let s = str.trim();

  // 1. Remove markdown fences (e.g. ```latex ... ```)
  s = s.replace(/^```(?:latex|math)?\s*/i, '').replace(/\s*```$/, '').trim();

  // 2. Strip enclosing math delimiters ($$...$$, $...$, \[...\], \(...\))
  s = s.replace(/^\$\$([\s\S]*)\$\$$/, '$1').trim();
  s = s.replace(/^\$([\s\S]*)\$$/, '$1').trim();
  s = s.replace(/^\\\[([\s\S]*)\\\]$/, '$1').trim();
  s = s.replace(/^\\\(([\s\S]*)\\\)$/, '$1').trim();

  // 3. Fix accidental double subscript variables like a_n_b_n -> a_n b_n or a_1_b_1 -> a_1 b_1
  s = s.replace(/([a-zA-Z])_([a-zA-Z0-9]+)_([a-zA-Z])_([a-zA-Z0-9]+)/g, '$1_{$2} $3_{$4}');

  // 4. Fix general consecutive unbraced underscores that cause "Double subscript" parse errors
  s = s.replace(/_([a-zA-Z0-9]+)_([a-zA-Z0-9]+)/g, '_{$1, $2}');
  s = s.replace(/_\{([^}]+)\}_\{([^}]+)\}/g, '_{$1, $2}');

  // 5. Fix double superscripts: x^2^3 -> x^{2^3}
  s = s.replace(/\^([a-zA-Z0-9]+)\^([a-zA-Z0-9]+)/g, '^{$1^{$2}}');

  // 6. Fix unescaped % (prevents rest of formula from being treated as LaTeX comment)
  s = s.replace(/(?<!\\)%/g, '\\%');

  // 7. Fix common operator symbols
  s = s.replace(/>=/g, '\\ge ');
  s = s.replace(/<=/g, '\\le ');
  s = s.replace(/!=/g, '\\ne ');

  return s;
};

const KaTeXRenderer = ({ latex }) => {
  const mathRef = useRef(null);

  useEffect(() => {
    if (mathRef.current && latex) {
      const cleanLatex = sanitizeLatex(latex);

      try {
        // Render sanitized LaTeX in display mode
        const html = katex.renderToString(cleanLatex, {
          throwOnError: true,
          displayMode: true,
        });
        mathRef.current.innerHTML = html;
      } catch (err) {
        // Fallback: If still failing, try gentle underscore escaping or non-strict render
        try {
          const aggressiveClean = cleanLatex.replace(/_/g, '\\_');
          const htmlFallback = katex.renderToString(aggressiveClean, {
            throwOnError: false,
            displayMode: true,
          });
          mathRef.current.innerHTML = htmlFallback;
        } catch (innerErr) {
          mathRef.current.textContent = latex;
        }
      }
    }
  }, [latex]);

  return (
    <span
      ref={mathRef}
      className="block overflow-x-auto p-3 my-2 bg-white/70 border border-[#e5e1d8] rounded-xl text-[#172554] shadow-inner text-center font-medium min-h-[2.5rem]"
    />
  );
};

export default KaTeXRenderer;
