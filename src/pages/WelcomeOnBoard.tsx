import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

interface Props {}

function WelcomeOnBoard(props: Props) {
  const navigate = useNavigate()
  const {} = props;

  return (
    <section className="flex min-h-screen mt-20 justify-center bg-background px-4 sm:px-6 lg:px-0">
      <div className="container  space-y-60">
        <div className="h-fit w-40 mx-auto">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/877fbded3c1141a18415be7a6b510b08/a1b8d17c054ef5d488ceefa5dd92f6dac50b4fdb1ceb3d816f63c57dcff44ae5?placeholderIfAbsent=true"
            alt="Company Logo"
            className="object-contain aspect-[3.6]"
          />
        </div>
        <div className="text-center">
          <h2 className="text-4xl font-bold text-primary font-urbanist">
            Welcome On Board
          </h2>

          <p className="text-xl font-medium font-urbanist text-gray-600 max-w-xl mx-auto mt-3">
            Superb! You are all set up and can begin to automate your sales,
            inventory management activities.
          </p>

          <Button onClick={() => navigate('/login')} className="w-96 mt-14">
            Get Started <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default WelcomeOnBoard;
