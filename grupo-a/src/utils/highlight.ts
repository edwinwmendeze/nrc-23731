import * as shiki from 'shiki';

const highlighterPromise = shiki.createHighlighter({ themes: ['nord'] });

export async function highlightCode(code: string, lang: string = 'javascript') {
  const highlighter = await highlighterPromise;
  return highlighter.codeToHtml(code, { lang, themes: ['nord'] });
}