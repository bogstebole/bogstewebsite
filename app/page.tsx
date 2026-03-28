import { V2Canvas } from "@/components/canvas/V2Canvas";
import { ThemeProvider } from "@/components/providers/theme-provider";

export default function Home() {
  return (
    <ThemeProvider>
      <V2Canvas />
    </ThemeProvider>
  );
}
