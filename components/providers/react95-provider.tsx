"use client";

import { ThemeProvider } from "styled-components";
import original from "react95/dist/themes/original";

export function React95Provider({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={original}>{children}</ThemeProvider>;
}
