import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/store/authSlice";
import { FaUser } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa6";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export const Header = () => {
  const isMobile = useIsMobile();
  const user = useUser();
  
  return (
    <header className="py-3 px-5 flex items-center justify-between border- w-full">
      <SidebarTrigger />

      <div className="flex items-center">
        <div className="h-10 w-10 bg-muted-foreground rounded-full cursor-pointer grid place-items-center mr-4">
          <FaRegBell className="text-black" />
        </div>

        <div className="h-6 bg-gray-400 w-0.5 rounded-lg" />

        <div className="flex items-center gap-2 pl-4">
          <div className=" flex cursor-pointer gap-2 items-center">
            {isMobile ? null : (
              <div>
                <p className="text-sm text-primary">{`${user?.first_name} ${user?.last_name}`}</p>
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
