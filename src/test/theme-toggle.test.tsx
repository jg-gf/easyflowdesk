import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ThemeToggle, THEME_KEY } from "@/components/theme-toggle";

afterEach(() => {
  cleanup();
  localStorage.removeItem(THEME_KEY);
  document.documentElement.classList.remove("dark");
});

describe("Theme preference", () => {
  it("switches between dark and light and stores both choices", () => {
    render(<ThemeToggle />);
    const toggle = screen.getByRole("switch", { name: "Tema escuro" });
    fireEvent.click(toggle);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem(THEME_KEY)).toBe("dark");
    fireEvent.click(toggle);
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(localStorage.getItem(THEME_KEY)).toBe("light");
  });
  it("restores the saved dark preference when mounted again", () => {
    localStorage.setItem(THEME_KEY, "dark");
    render(<ThemeToggle />);
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe("true");
  });
});