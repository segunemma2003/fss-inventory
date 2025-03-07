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
  MapPin,
  Building,
  Mail,
  FolderOpen,
  IdCard,
  Globe,
  Pin,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router";

type FormValue = {};

export const RegisterOne = () => {
  const navigate = useNavigate();
  const { ForgeForm } = useForge({});
  const handler = useToastHandlers();

  const { mutate, isPending } = useMutation<
    ApiResponse<any>,
    ApiResponseError,
    FormValue
  >({
    mutationFn: async (payload) => postRequest("", payload),
    onSuccess(data) {
      handler.success("Registration", data.data.message);
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
          <div className="flex justify-end my-10 w-full">
            <Badge
              variant={"default"}
              className="text-muted-foreground font-urbanist"
            >
              1/<span className="opacity-40">2</span>
            </Badge>
          </div>
          <h2 className="text-4xl font-bold text-primary font-urbanist">
            Almost There
          </h2>
          <p className="mt-2 text-xl text-gray-600 font-medium font-urbanist max-w-6xl">
            Tell us about your business. This will help us tailor our system to
            match and suite your needs by providing a bit more legible
            information about your business.
          </p>
        </div>

        <ForgeForm onSubmit={mutate}>
          <div className="grid grid-cols-4 space-y-5 mb-10 gap-3">
            <Forger
              component={TextInput}
              name="businessName"
              containerClass="col-span-2"
              placeholder="Business Name"
              startAdornment={
                <Building className="h-5 w-5 mr-2 text-gray-400" />
              }
            />
            <Forger
              component={TextInput}
              name="businessAddress"
              containerClass="col-span-2"
              placeholder="Business Address"
              startAdornment={<MapPin className="h-5 w-5 mr-2 text-gray-400" />}
            />
            <Forger
              name="industry"
              component={TextInput}
              containerClass="col-span-2"
              placeholder="Industry e.g Finance, e-commerce"
              startAdornment={
                <Building className="h-5 w-5 mr-2 text-gray-400" />
              }
            />
            <Forger
              name="businessType"
              component={TextInput}
              placeholder="Business type e.g Retail, Wholesales"
              containerClass="col-span-2"
              startAdornment={
                <Building className="h-5 w-5 mr-2 text-gray-400" />
              }
            />
            <Forger
              component={TextInput}
              name="businessEmail"
              placeholder="Registered Business Email Address"
              startAdornment={<Mail className="h-5 w-5 mr-2 text-gray-400" />}
            />
            <Forger
              component={TextInput}
              name="businessCac"
              placeholder="Registered Business CAC"
              startAdornment={
                <FolderOpen className="h-5 w-5 mr-2 text-gray-400" />
              }
            />
            <Forger
              component={TextInput}
              name="numberOfEmployees"
              placeholder="Number of Employees"
              startAdornment={<IdCard className="h-5 w-5 mr-2 text-gray-400" />}
            />
            <Forger
              component={TextInput}
              name="country"
              placeholder="Country/Region"
              startAdornment={<Globe className="h-5 w-5 mr-2 text-gray-400" />}
            />
            <Forger
              component={TextInput}
              name="businessAddress"
              placeholder="Business Address"
              startAdornment={<MapPin className="h-5 w-5 mr-2 text-gray-400" />}
            />
            <Forger
              component={TextInput}
              name="zipCode"
              placeholder="Zip Code"
              startAdornment={<Pin className="h-5 w-5 mr-2 text-gray-400" />}
            />
          </div>

          <div>
            <Button
              // type="submit"
              isLoading={isPending}
              onClick={() => navigate("/personal-registration")}
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
