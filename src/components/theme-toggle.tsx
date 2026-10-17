import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export const THEME_KEY = "flowdesk.theme.v1";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);
  const [warning, setWarning] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      const selected = saved === "dark";
      document.documentElement.classList.toggle("dark", selected);
      setDark(selected);
    } catch {
      setWarning("A preferência de tema não pôde ser recuperada neste navegador.");
    }
    setReady(true);
  }, []);

  function toggle() {
    const selected = !dark;
    setDark(selected);
    document.documentElement.classList.toggle("dark", selected);
    try {
      localStorage.setItem(THEME_KEY, selected ? "dark" : "light");
      setWarning("");
    } catch {
      setWarning("O tema foi alterado, mas este navegador não permitiu salvar a preferência.");
    }
  }

  return (
    <div className="relative shrink-0">
      <Button variant="ghost" size="icon" role="switch" aria-label="Tema escuro" aria-checked={dark}
        title={dark ? "Ativar tema claro" : "Ativar tema escuro"} disabled={!ready} onClick={toggle}
        className="border border-sidebar-foreground/20 text-sidebar-foreground hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground">
        {dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
      </Button>
      {warning && <span role="status" className="absolute right-0 top-11 z-10 w-64 rounded-md border border-border bg-popover p-3 text-xs text-popover-foreground shadow-sm">{warning}</span>}
    </div>
  );
}