import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { Button } from "@/components/ui/button";
import { useToastHandlers } from "@/hooks/useToaster";
import { postRequest } from "@/lib/axiosInstance";
import { Forger, useForge } from "@/lib/forge";
import { ApiResponse, ApiResponseError } from "@/types";
import { useMutation } from "@tanstack/react-query";
import {
  Mail,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router";

type FormValue = {};

export const Verification = () => {
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
    <section className="flex min-h-screen lg:mt-20 justify-center bg-gray-50 px-4 sm:px-6 lg:px-0">
      <div className="w-full lg:px-8 container">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/877fbded3c1141a18415be7a6b510b08/a1b8d17c054ef5d488ceefa5dd92f6dac50b4fdb1ceb3d816f63c57dcff44ae5?placeholderIfAbsent=true"
          alt="Company Logo"
          className="object-contain aspect-[3.6] w-[216px]"
        />

        <div className="mt-16 mb-8">
          <h2 className="text-4xl font-bold text-primary font-urbanist">
            Let’s Verify your email
          </h2>
          <p className="mt-2 text-xl text-gray-600 font-medium font-urbanist max-w-4xl">
            To complete your profile and start enjoying the most effective
            inventory management system, you’ll need to verify your email
            address.
          </p>
        </div>

        <ForgeForm onSubmit={mutate}>
          <div className="grid grid-cols-4 space-y-5 mb-10 gap-3">
            <Forger
              component={TextInput}
              name="email"
              containerClass="col-span-2"
              placeholder="Email Address"
              helperText="A link will be sent to this email address, click the link to verify your account."
              startAdornment={<Mail className="h-5 w-5 mr-2 text-gray-400" />}
            />
          </div>

          <div>
            <Button
              // type="submit"
              isLoading={isPending}
              onClick={() => navigate("/terms-conditions")}
              className="w-60"
            >
              Verify <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </ForgeForm>
      </div>
    </section>
  );
};
