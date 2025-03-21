import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToastHandlers } from "@/hooks/useToaster";
import { patchRequest } from "@/lib/axiosInstance";
import { Forger, useForge } from "@/lib/forge";
import { ApiResponse, ApiResponseError } from "@/types";
import { useMutation } from "@tanstack/react-query";
import {
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

type FormValue = {
  business_name: string;
  business_address: string;
  business_phone_number: string;
  business_website: string;
  business_type: string;
  business_email: string;
  industry: string;
  cac_number: string;
  no_of_employees: string;
  country: string;
  zipcode: string;
};

export const RegisterOne = () => {
  const navigate = useNavigate();
  const handler = useToastHandlers();
  const { ForgeForm, setError } = useForge<FormValue>({});

  const { mutate, isPending } = useMutation<
    ApiResponse<any>,
    ApiResponseError,
    FormValue
  >({
    mutationFn: async (payload) =>
      patchRequest("/auth/business-profile/", payload),
    onSuccess(data) {
      if (typeof data.data.message === "string") {
        handler.success("Registration", data.data.message);
      }
      navigate("/terms-conditions")
    },
    onError(error) {
      const errorData = error.response?.data;
      if (typeof errorData?.message === "object") {
        Object.entries(errorData?.message).forEach(([key, value]) =>
          setError(key as keyof FormValue, { message: value?.[0] ?? "" })
        );
      }

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
              name="business_name"
              containerClass="col-span-2"
              placeholder="Business Name"
              startAdornment={
                <Building className="h-5 w-5 mr-2 text-gray-400" />
              }
            />
            <Forger
              component={TextInput}
              name="business_phone_number"
              containerClass="col-span-2"
              placeholder="Business Phone Number"
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
              name="business_type"
              component={TextInput}
              placeholder="Business type e.g Retail, Wholesales"
              containerClass="col-span-2"
              startAdornment={
                <Building className="h-5 w-5 mr-2 text-gray-400" />
              }
            />
             <Forger
              component={TextInput}
              name="cac_number"
              placeholder="Registered Business CAC"
              startAdornment={
                <FolderOpen className="h-5 w-5 mr-2 text-gray-400" />
              }
            />
            <Forger
              component={TextInput}
              name="business_email"
              containerClass="col-span-2"
              placeholder="Registered Business Email Address"
              startAdornment={<Mail className="h-5 w-5 mr-2 text-gray-400" />}
            />
           
            <Forger
              component={TextInput}
              name="no_of_employees"
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
              name="business_address"
              containerClass="col-span-2"
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
              type="submit"
              isLoading={isPending}
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
