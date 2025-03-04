import Container from "@/components/layouts/Container";
import { Outlet } from "react-router";

export const AuthLayout = () => {
  return (
    <Container
      noGutter
      fullWidth
      fullHeight
      // display="flex"
      className="overflow-hidden bg-background"
    >
      <Outlet />
    </Container>
  );
};
