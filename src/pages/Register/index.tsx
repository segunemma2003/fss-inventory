import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { useForge } from "@/lib/forge/useForge";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

type RegisterFormValues = {
  fullName: string;
  email: string;
};

export const Register = () => {
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center gap-2">
          <img src="/vite.svg" alt="Logo" className="h-8 w-8" />
          <h2 className="text-xl font-semibold text-gray-900">FOOD STUFF STORE</h2>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900">Let's Get You Started</h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome to your inventory system, your ultimate solution to elevating your sales management.
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
            />
            <TextInput
              name="email"
              label="Email Address"
              placeholder="Enter your email address"
              type="email"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
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
    </div>
  );
};

export default Register;