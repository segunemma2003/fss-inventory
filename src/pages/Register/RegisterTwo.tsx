import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToastHandlers } from "@/hooks/useToaster";
import { postRequest } from "@/lib/axiosInstance";
import { Forger, useForge } from "@/lib/forge";
import { ApiResponse, ApiResponseError } from "@/types";
import { useMutation } from "@tanstack/react-query";
import {
  User,
  Mail,
  ArrowRight,
  ArrowLeft,
  Users,
  Calendar,
  Phone,
  Contact,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router";

type FormValue = {};

export const RegisterTwo = () => {
  const { ForgeForm } = useForge({});
  const navigate = useNavigate();
  const handler = useToastHandlers();

  const { mutate, isPending } = useMutation<
    ApiResponse<any>,
    ApiResponseError,
    FormValue
  >({
    mutationFn: async (payload) => postRequest("", payload),
    onSuccess(data) {
      if(typeof data?.data?.message === "string") {
        handler.success("Registration", data?.data?.message);
      }
    },
    onError(error) {
      handler.error("Registration", error);
    },
  });

  return (
    <section className="flex min-h-screen  items-center justify-center bg-background px-4 sm:px-6 lg:px-0">
      <div className="w-full lg:px-8 container">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/877fbded3c1141a18415be7a6b510b08/a1b8d17c054ef5d488ceefa5dd92f6dac50b4fdb1ceb3d816f63c57dcff44ae5?placeholderIfAbsent=true"
          alt="Company Logo"
          className="object-contain aspect-[3.6] w-[216px]"
        />

        <div className="mt-16 mb-8">
          <div className="flex justify-end items-center my-10 w-full gap-3">
            <Button
              size={"icon"}
              className="rounded-full"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Badge
              variant={"default"}
              className="text-muted-foreground font-urbanist"
            >
              2/<span className="opacity-40">2</span>
            </Badge>
          </div>
          <h2 className="text-4xl font-bold text-primary font-urbanist">
            One more headlight!
          </h2>
          <p className="mt-2 text-xl text-gray-600 font-medium font-urbanist max-w-6xl">
            Tell us about yourself. This will help us tailor our system to match
            and place necessary information for easy accessibility in your
            profile
          </p>
        </div>

        <ForgeForm onSubmit={mutate}>
          <div className="grid grid-cols-4 space-y-5 mb-10 gap-3">
            <Forger
              component={TextInput}
              name="firstName"
              containerClass="col-span-2"
              placeholder="First Name"
              startAdornment={<User className="h-5 w-5 mr-2 text-gray-400" />}
            />
            <Forger
              component={TextInput}
              name="lastName"
              containerClass="col-span-2"
              placeholder="Last Name"
              startAdornment={<User className="h-5 w-5 mr-2 text-gray-400" />}
            />
            <Forger
              name="gender"
              component={TextInput}
              containerClass="col-span-2"
              placeholder="Gender"
              startAdornment={<Users className="h-5 w-5 mr-2 text-gray-400" />}
            />
            <Forger
              name="email"
              component={TextInput}
              placeholder="Email Address"
              containerClass="col-span-2"
              startAdornment={<Mail className="h-5 w-5 mr-2 text-gray-400" />}
            />
            <Forger
              component={TextInput}
              name="dateOfBirth"
              placeholder="Date Of Birth"
              startAdornment={<Calendar className="h-5 w-5 mr-2 text-gray-400" />}
            />
            <Forger
              component={TextInput}
              name="phoneNumber"
              placeholder="Phone Number"
              containerClass="col-span-2"
              startAdornment={<Phone className="h-5 w-5 mr-2 text-gray-400" />}
            />
            <Forger
              component={TextInput}
              name="jobTitle"
              placeholder="Job Title"
              startAdornment={<Contact className="h-5 w-5 mr-2 text-gray-400" />}
            />
            <Forger
              component={TextInput}
              name="role"
              placeholder="Role"
              startAdornment={<Contact className="h-5 w-5 mr-2 text-gray-400" />}
            />
            <Forger
              component={TextInput}
              name="password"
              placeholder="Password"
              containerClass="col-span-2"
              startAdornment={<Lock className="h-5 w-5 mr-2 text-gray-400" />}
            />
            <Forger
              component={TextInput}
              name="confirmPassword"
              placeholder="Confirm Password"
              startAdornment={<Lock className="h-5 w-5 mr-2 text-gray-400" />}
            />
          </div>

          <div>
            <Button
              // type="submit"
              isLoading={isPending}
              onClick={() => navigate("/")}
              className="w-60"
            >
              Continue <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </ForgeForm>
      </div>
    </section>
  );
};
