import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/store/authSlice";
import { FaUser } from "react-icons/fa";
// import { FaRegBell } from "react-icons/fa6";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";
import { useDarkMode } from "usehooks-ts";
import ThemeSwitch from "@/components/ui/theme-switch";
import { NotificationPanel } from "./NotificationPanel";

export const Header = () => {
  const user = useUser();
  const isMobile = useIsMobile();

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
    <header className="py-3 px-5 flex items-center justify-between border- w-full">
      <SidebarTrigger />

      <div className="flex items-center">
        <ThemeSwitch
          checked={isDarkMode}
          setChecked={(value) => {
            set(value);
            toggleDarkMode(value);
          }}
        />
        
        <NotificationPanel />

        <div className="h-6 bg-gray-400 w-0.5 rounded-lg" />

        <div className="flex items-center gap-2 pl-4">
          <div className=" flex cursor-pointer gap-2 items-center">
            {isMobile ? null : (
              <div>
                <p className="text-sm text-primary">{`${user?.full_name}`}</p>
                <p className="text-xs">{user?.role}</p>
              </div>
            )}
          </div>
          <Avatar className="!bg-gray-300 text-primary h-10 w-10">
            <AvatarImage src="" alt="" />
            <AvatarFallback>
              <FaUser />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};
