import {
  TextInput,
  TextPassword,
} from "@/components/layouts/FormInputs/TextInput";
import { useForge } from "@/lib/forge/useForge";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { Forger } from "@/lib/forge";
import { Link } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { postRequest } from "@/lib/axiosInstance";
import { useToastHandlers } from "@/hooks/useToaster";
import { ApiResponse, ApiResponseError, User } from "@/types";
import { getLoginToken, getLoginUser } from "@/demo";
import { useSetToken, useSetUser } from "@/store/authSlice";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";

type FormValue = {
  email: string;
  password: string;
};
export interface LoginResponse {
  access_token:  string;
  refresh_token: string;
  user:          User;
}


const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export const Login = () => {
  const setUser = useSetUser();
  const setToken = useSetToken();
  const handler = useToastHandlers();
  const [userType, setUserType] = useState<"admin" | "sales" | "inventory">(
    "admin"
  );

  const { ForgeForm } = useForge<FormValue>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const { mutate, isPending } = useMutation<
    ApiResponse<LoginResponse>,
    ApiResponseError,
    FormValue
  >({
    mutationFn: async (payload) => postRequest("/auth/login/", payload),
    onSuccess(data) {
      const { access_token, user } = data.data.data;

      setUser(user);
      setToken(access_token);
      handler.success("Authentication", data.data.message);
    },
    onError(error) {
      handler.error("Registration", error);
    },
  });

  const handleGoogleAuth = () => {
    // Implement Google OAuth logic here
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mx-auto w-fit">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/877fbded3c1141a18415be7a6b510b08/a1b8d17c054ef5d488ceefa5dd92f6dac50b4fdb1ceb3d816f63c57dcff44ae5?placeholderIfAbsent=true"
            alt="Company Logo"
            className="object-contain aspect-[3.6] w-[216px]"
          />
        </div>

        <div className="mt-8 text-center mb-5">
          <h2 className="text-2xl font-bold text-primary">Welcome Back</h2>
          <p className="mt-2 text-sm text-muted-foreground md:w-80 mx-auto font-urbanist font-semibold">
            Hello there, welcome back! Let's get you signed in and kick off from
            where you left off.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-10">
          <Button
            variant={userType === "admin" ? "default" : "outline"}
            onClick={() => setUserType("admin")}
            className="w-fit rounded-full"
          >
            Admin
          </Button>
          <Button
            variant={userType === "sales" ? "default" : "outline"}
            onClick={() => setUserType("sales")}
            className="w-fit rounded-full"
          >
            Sales
          </Button>
          <Button
            variant={userType === "inventory" ? "default" : "outline"}
            onClick={() => setUserType("inventory")}
            className="w-fit rounded-full"
          >
            Inventory
          </Button>
        </div>

        <ForgeForm onSubmit={mutate} className="mt-10">
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
            <div className="text-sm text-muted-foreground">
              <a href="/forgot-password" className="">
                Forgot Password?
              </a>
            </div>
          </div>

          <Button type="submit" isLoading={isPending} className="w-full mt-10">
            Login
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <div className="text-center text-xs mt-2">
            <span className="text-gray-500">Don't have a profile, </span>
            <Link to="/" className="text-red-500 hover:text-red-600">
              Sign me up!
            </Link>
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
              variant={'outline'}
              onClick={handleGoogleAuth}
              className="w-full  rounded-full"
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
