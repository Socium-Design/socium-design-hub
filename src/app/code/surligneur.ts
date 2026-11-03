import type { HighlighterCore, ThemeRegistrationRaw } from 'shiki/core';
import { LangageCode, THEME_CODE } from './theme-code';

let instance: Promise<HighlighterCore> | undefined;

/** HTML coloré par Shiki (thème THEME_CODE). Shiki et ses grammaires sont chargés à la première demande. */
export async function surligner(code: string, langage: LangageCode): Promise<string> {
  instance ??= charger();
  const shiki = await instance;
  return shiki.codeToHtml(code, { lang: langage, theme: THEME_CODE.shiki });
}

async function charger(): Promise<HighlighterCore> {
  const [{ createHighlighterCore }, { createJavaScriptRegexEngine }, darkPlus, ...langages] = await Promise.all([
    import('shiki/core'),
    import('shiki/engine/javascript'),
    import('shiki/themes/dark-plus.mjs'),
    import('shiki/langs/angular-ts.mjs'),
    import('shiki/langs/typescript.mjs'),
    import('shiki/langs/json.mjs'),
    import('shiki/langs/shellscript.mjs'),
    import('shiki/langs/ini.mjs'),
  ]);
  return createHighlighterCore({
    themes: [ajuster(darkPlus.default as ThemeRegistrationRaw)],
    langs: langages.map((l) => l.default),
    engine: createJavaScriptRegexEngine(),
  });
}

/** Applique les remplacements de contraste de THEME_CODE à toutes les couleurs du thème. */
function ajuster(theme: ThemeRegistrationRaw): ThemeRegistrationRaw {
  const texte = JSON.stringify(theme).replace(/#[0-9a-f]{6}\b/gi, (c) => THEME_CODE.remplacements[c.toUpperCase()] ?? c);
  return JSON.parse(texte) as ThemeRegistrationRaw;
}
