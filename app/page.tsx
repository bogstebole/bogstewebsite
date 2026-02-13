import { Header } from "@/components/ui/header";
import { GameCanvas } from "@/components/canvas/GameCanvas";
import { ThemeProvider } from "@/components/providers/theme-provider";

export default function Home() {
  return (
    <ThemeProvider>
      <Header />
      <GameCanvas />
    </ThemeProvider>
  );
}
