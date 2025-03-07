import Container from "@/components/layouts/Container";
import { Outlet } from "react-router";
import { SideBar } from "./Sidebar";
import { Header } from "./Header";
import { SidebarProvider } from "@/components/ui/sidebar";

export const Dashboard = () => {

  return (
    <Container
      noGutter
      fullWidth
      fullHeight
      display="flex"
      className="overflow-x-hidden overflow-y-auto"
      as={SidebarProvider}
    >
        <SideBar />
        <main className="flex-1">
          <Header />
          <Outlet />
        </main>
    </Container>
  );
};
