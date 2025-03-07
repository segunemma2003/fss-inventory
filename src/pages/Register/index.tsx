import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { useForge } from "@/lib/forge/useForge";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FeatureSection } from "./layoout/FeatureSection";
import { useNavigate } from "react-router";
import { Mail, User } from "lucide-react";

type RegisterFormValues = {
  fullName: string;
  email: string;
};

export const Register = () => {
  const navigate = useNavigate()
  const { ForgeForm } = useForge<RegisterFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  const handleSubmit = (values: RegisterFormValues) => {
    console.log(values);
  };

  const handleGoogleAuth = () => {
    // Implement Google OAuth logic here
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-0">
      <div className="w-full max-w-xl lg:px-8">
        <div className="flex items-center gap-2">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/877fbded3c1141a18415be7a6b510b08/a1b8d17c054ef5d488ceefa5dd92f6dac50b4fdb1ceb3d816f63c57dcff44ae5?placeholderIfAbsent=true"
            alt="Company Logo"
            className="object-contain aspect-[3.6] w-[216px]"
          />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Let's Get You Started
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome to your inventory system, your ultimate solution to
            elevating your sales management.
          </p>
        </div>

        <ForgeForm onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <TextInput
              name="fullName"
              label="Full Name"
              placeholder="Enter your full name"
              autoComplete="name"
              required
              startAdornment={<User className="h-5 w-5 mr-2" />}
            />
            <TextInput
              name="email"
              label="Email Address"
              placeholder="Enter your email address"
              type="email"
              autoComplete="email"
              required
              startAdornment={<Mail className="h-5 w-5 mr-2" />}
            />
          </div>

          <div>
            <Button
              // type="submit"
              onClick={() => navigate('/business-registration')}
              className="w-full "
            >
              Create Account
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 px-2 text-gray-500">OR</span>
            </div>
          </div>

          <div>
            <Button
              type="button"
              onClick={handleGoogleAuth}
              className="w-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-500">Hey, I do have an account? </span>
            <a href="/login" className="text-red-500 hover:text-red-600">
              Sign me in!
            </a>
          </div>
        </ForgeForm>
      </div>
      <div className="flex-1">
        <FeatureSection />
      </div>
    </div>
  );
};

export default Register;
