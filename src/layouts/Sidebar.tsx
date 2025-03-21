/* eslint-disable @typescript-eslint/no-explicit-any */
import { MdDashboard } from "react-icons/md";
import { Link, useLocation } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BsCardChecklist } from "react-icons/bs";
import { ConfirmAlert } from "@/components/layouts/ConfirmAlert";
import { IconType } from "react-icons/lib";
// import { MdOutlineAnalytics } from "react-icons/md";
import { TfiReceipt } from "react-icons/tfi";
import { MdOutlineReceiptLong } from "react-icons/md";
import { HiOutlineCog8Tooth } from "react-icons/hi2";
import { TbUserSquare } from "react-icons/tb";
// import { FaRegEdit } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { RiLogoutCircleLine } from "react-icons/ri";
import { format } from 'date-fns';
import { UserRoundPen } from "lucide-react";

type NavigationItem = {
  icon: IconType;
  title: string;
  to: string;
  active: boolean;
  badge?: number;
};

export const SideBar = () => {
  const location = useLocation();

  const navigation: NavigationItem[] = [
    {
      icon: MdDashboard,
      title: "Dashboard",
      to: "/dashboard/",
      active: location.pathname === "/dashboard/",
    },
    {
      icon: BsCardChecklist,
      title: "Product Inventory",
      // badge: 3,
      to: "/dashboard/product-inventory",
      active: location.pathname === "/dashboard/product-inventory",
    },
    // {
    //   icon: MdOutlineAnalytics,
    //   title: "Sales Performance",
    //   to: "/dashboard/sales-performance",
    //   active: location.pathname === "/dashboard/sales-performance",
    // },
    {
      icon: TfiReceipt,
      title: "Sales Analytics",
      to: "/dashboard/sales-analytics",
      active: location.pathname === "/dashboard/sales-analytics",
    },
    {
      icon: MdOutlineReceiptLong,
      title: "Customer Order",
      to: "/dashboard/customer-order",
      active: location.pathname === "/dashboard/customer-order",
    },
    {
      icon: HiOutlineCog8Tooth,
      title: "Business ID",
      to: "/dashboard/business-id",
      active: location.pathname === "/dashboard/business-id",
    },
  ];

  const userManageNavigation: NavigationItem[] = [
    {
      icon: TbUserSquare,
      title: "User Profile",
      to: "/dashboard/user-profile",
      active: location.pathname === "/dashboard/user-profile",
    },
    {
      icon: UserRoundPen as any,
      title: "Roles",
      to: "/dashboard/roles",
      active: location.pathname === "/dashboard/roles",
    },
    {
      icon: HiOutlineCog8Tooth,
      title: "Settings",
      to: "/dashboard/settings",
      active: location.pathname === "/dashboard/settings",
    },
  ];

  return (
    <Sidebar className="" variant="sidebar">
      <SidebarHeader className="py-8">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/877fbded3c1141a18415be7a6b510b08/a1b8d17c054ef5d488ceefa5dd92f6dac50b4fdb1ceb3d816f63c57dcff44ae5?placeholderIfAbsent=true"
          alt="Company Logo"
          className="object-contain aspect-[3.6] w-40 mx-auto"
        />
      </SidebarHeader>

      <SidebarContent className="mt-8 px-2.5">
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3">
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.active}>
                    <Link
                      to={item.to}
                      className="data-[active=true]:!bg-primary data-[active=true]:text-white data-[active=true]:rounded-full px-4 py-2"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="">
          <SidebarGroupLabel>User Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-3">
              {userManageNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.active}>
                    <Link to={item.to} className="data-[active=true]:!bg-primary data-[active=true]:text-white data-[active=true]:rounded-full px-4 py-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <ConfirmAlert
          title="Are you sure you want to sign out?"
          text="You will be signed out of your account and will not be able to access it again."
          logout
          icon={RiLogoutCircleLine}
          trigger={
            <Button variant={"outline"} className="rounded-full w-full">
              <RiLogoutCircleLine className="mr-5" /> Sign Out
            </Button>
          }
        />
        <div className="py-2">
          <h6 className="text-xs font-urbanist font-semibold">Last Login:</h6>
          <p className="text-sm font-urbanist ">{format('12/04/2025', 'do MMMM yyyy hh:mm')}</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
