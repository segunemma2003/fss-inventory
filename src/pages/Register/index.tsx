import {
  TextInput,
  TextPassword,
} from "@/components/layouts/FormInputs/TextInput";
import { useForge } from "@/lib/forge/useForge";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FeatureSection } from "./layoout/FeatureSection";
import { Link, useNavigate } from "react-router";
import { Mail, Phone, User, Lock } from "lucide-react";
import { ApiResponse, ApiResponseError } from "@/types";
import { postRequest } from "@/lib/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useToastHandlers } from "@/hooks/useToaster";
import { Forger } from "@/lib/forge";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type FormValue = {
  full_name: string;
  email: string;
  phone_number: string;
  password: string;
};

const schema = yup.object().shape({
  full_name: yup.string().required("Full Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phone_number: yup.string().required("Phone Number is required"),
  password: yup.string().required("Password is required"),
});

export const Register = () => {
  const navigate = useNavigate();
  const handler = useToastHandlers();

  const { ForgeForm } = useForge<FormValue>({
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const { mutate, isPending } = useMutation<
    ApiResponse<any>,
    ApiResponseError,
    FormValue
  >({
    mutationFn: async (payload) => postRequest("/auth/register/", payload),
    onSuccess(data, variables) {
      handler.success("Registration", data.data.message);
      navigate("/verification", { state: { email: variables.email } });
    },
    onError(error) {
      handler.error("Registration", error);
    },
  });

  const handleGoogleAuth = () => {
    // Implement Google OAuth logic here
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-0">
      <div className="w-full max-w-xl lg:px-8">
        <div className="flex items-center gap-2">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/877fbded3c1141a18415be7a6b510b08/a1b8d17c054ef5d488ceefa5dd92f6dac50b4fdb1ceb3d816f63c57dcff44ae5?placeholderIfAbsent=true"
            alt="Company Logo"
            className="object-contain aspect-[3.6] w-[216px]"
          />
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-accent-foreground">
            Let's Get You Started
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome to your inventory system, your ultimate solution to
            elevating your sales management.
          </p>
        </div>

        <ForgeForm onSubmit={mutate} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Forger
              component={TextInput}
              name="full_name"
              label="Full Name"
              placeholder="Enter your full name"
              autoComplete="name"
              required
              startAdornment={<User className="h-5 w-5 mr-2" />}
            />
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
              component={TextInput}
              name="phone_number"
              placeholder="Phone Number"
              type="tel"
              autoComplete="tel"
              required
              startAdornment={<Phone className="h-5 w-5 mr-2" />}
            />
            <Forger
              component={TextPassword}
              name="password"
              placeholder="Password"
              type="tel"
              autoComplete="tel"
              required
              startAdornment={<Lock className="h-5 w-5 mr-2" />}
            />
          </div>

          <div>
            <Button type="submit" isLoading={isPending} className="w-full">
              Create Account
            </Button>
          </div>
        </ForgeForm>

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
            variant={"outline"}
            onClick={handleGoogleAuth}
            className="w-full text-muted-foreground rounded-full"
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>
        </div>

        <div className="text-center text-sm mt-3">
          <span className="text-gray-500">Hey, I do have an account? </span>
          <Link to="/login" className="text-red-500 hover:text-red-600">
            Sign me in!
          </Link>
        </div>
      </div>
      <div className="flex-1">
        <FeatureSection />
      </div>
    </div>
  );
};

export default Register;
