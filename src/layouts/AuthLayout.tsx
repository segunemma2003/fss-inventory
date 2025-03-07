import Container from "@/components/layouts/Container";
import ThemeSwitch from "@/components/ui/theme-switch";
import { Outlet } from "react-router";
import { useDarkMode } from "usehooks-ts";

export const AuthLayout = () => {
  const { isDarkMode, set } = useDarkMode({
    // defaultValue: true,
    localStorageKey: "theme",
  });

  return (
    <Container
      noGutter
      fullWidth
      fullHeight
      // display="flex"
      className="overflow-hiddn bg-background"
    >
      <div className="absolute right-3 top-3">
        <ThemeSwitch checked={isDarkMode} setChecked={set} />
      </div>
      <Outlet />
    </Container>
  );
};
