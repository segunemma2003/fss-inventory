import Container from "@/components/layouts/Container";
import ThemeSwitch from "@/components/ui/theme-switch";
import { useEffect } from "react";
import { Outlet } from "react-router";
import { useDarkMode } from "usehooks-ts";

export const AuthLayout = () => {
  const { isDarkMode, set } = useDarkMode({
    defaultValue: true,
    localStorageKey: "theme",
  });

  // Apply the dark mode class to the root element
  const toggleDarkMode = (isDark: boolean) => {
    const rootElement = document.documentElement;
    if (isDark) {
      rootElement.classList.add("dark");
    } else {
      rootElement.classList.remove("dark");
    }
  };

  // Ensure dark mode class is applied on mount and toggle
  useEffect(() => {
    toggleDarkMode(isDarkMode);
  }, [isDarkMode]);

  return (
    <Container
      noGutter
      fullWidth
      fullHeight
      className="overflow-hidden bg-background"
    >
      <div className="absolute right-3 top-3">
        <ThemeSwitch checked={isDarkMode} setChecked={(value) => { set(value); toggleDarkMode(value); }} />
      </div>
      <Outlet />
    </Container>
  );
};
