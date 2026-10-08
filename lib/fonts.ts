// Self-hosted from public/fonts. The @font-face rules and these classes live
// in app/fonts.css — see the note there for why this isn't next/font/google.
// Each `variable` class puts one font's CSS variable on <body>, as next/font did.

export const geistSans = { variable: "geist-sans-font" };
export const geistMono = { variable: "geist-mono-font" };
export const inter = { variable: "inter-font" };
export const silkscreen = { variable: "silkscreen-font" };
export const jetbrainsMono = { variable: "jetbrains-mono-font" };
export const specialElite = { variable: "special-elite-font" };

// Preloaded the way next/font preloaded them: the latin file of each family.
// Every other subset loads only when a page needs one of its characters.
export const preloadedFonts = [
  "/fonts/geist-latin.woff2",
  "/fonts/geist-mono-latin.woff2",
  "/fonts/inter-latin.woff2",
  "/fonts/silkscreen-latin-400.woff2",
  "/fonts/silkscreen-latin-700.woff2",
  "/fonts/jetbrains-mono-latin.woff2",
  "/fonts/special-elite-latin.woff2",
];
