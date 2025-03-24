import Container from "@/components/layouts/Container";

export const UnAuthorized = () => {
  return (
    <Container className="pt-6 h-full pb-20">
      <div className="border mx-auto text-red-400 border-red-600 rounded-md w-96 text-center py-8">
        <h2>You do not have authorization to view this page</h2>
        <p>Contact your administrator for access.</p>
      </div>
    </Container>
  );
};