import {
  TextInput,
  TextPassword,
} from "@/components/layouts/FormInputs/TextInput";
import { useForge } from "@/lib/forge/useForge";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { Forger } from "@/lib/forge";

type LoginFormValues = {
  email: string;
  password: string;
};

export const Login = () => {
  const { ForgeForm } = useForge<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (values: LoginFormValues) => {
    console.log(values);
  };

  const handleGoogleAuth = () => {
    // Implement Google OAuth logic here
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mx-auto w-fit">
          <img src="/vite.svg" alt="Logo" className="h-8 w-8" />
          <h2 className="text-xl font-semibold text-gray-900">
            FOOD STUFF STORE
          </h2>
        </div>

        <div className="mt-8 text-center mb-5">
          <h2 className="text-2xl font-bold text-primary">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600 md:w-80 mx-auto">
            Hello there, welcome back! Let's get you signed in and kick off from
            where you left off.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-10">
          <Button variant="default" className="w-fit rounded-full">
            Admin
          </Button>
          <Button variant="outline" className="w-fit rounded-full">
            Sales
          </Button>
          <Button variant="outline" className="w-fit rounded-full">
            Inventory
          </Button>
        </div>

        <ForgeForm onSubmit={handleSubmit} className="mt-10">
          <div className="space-y-4">
            <Forger
              component={TextInput}
              name="email"
              label="Email Address"
              placeholder="Enter your email address"
              type="email"
              autoComplete="email"
              required
              startAdornment={<Mail className="h-5 w-5 mr-2" />}
            />
            <Forger
              component={TextPassword}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
              autoComplete="current-password"
              required
              startAdornment={<Lock className="h-5 w-5 mr-2" />}
            />
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="text-sm">
              <a href="/forgot-password" className="">
                Forgot Password?
              </a>
            </div>
            <div className="text-sm text-red-500 hover:text-red-600">
              3 attempts
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 mt-10"
          >
            Login
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <div className="text-center text-xs mt-2">
            <span className="text-gray-500">Don't have a profile, </span>
            <a href="/register" className="text-red-500 hover:text-red-600">
              Sign me up!
            </a>
          </div>

          <div className="relative my-5">
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
              className="w-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 rounded-full"
            >
              <FcGoogle className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
          </div>
        </ForgeForm>
      </div>
    </div>
  );
};
