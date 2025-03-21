import Container from "@/components/layouts/Container";
import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { Button } from "@/components/ui/button";
import { useToastHandlers } from "@/hooks/useToaster";
import { postRequest } from "@/lib/axiosInstance";
import { Forger, useForge } from "@/lib/forge";
import { ApiResponse, ApiResponseError } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, TextCursorInput } from "lucide-react";
import { useLocation, useNavigate } from "react-router";

type FormValue = {
  email: string;
  otp: string;
};

export const Verification = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { ForgeForm, setError } = useForge<FormValue>({
    defaultValues: {
      email: location.state?.email || "",
      otp: "",
    },
  });
  const handler = useToastHandlers();

  const { mutate, isPending } = useMutation<
    ApiResponse<any>,
    ApiResponseError,
    FormValue
  >({
    mutationFn: async (payload) => postRequest("/auth/verify-email/", payload),
    onSuccess(data) {
      if (typeof data.data.message === "string") {
        handler.success("Email VVerification", data.data.message);
      }
      navigate("/terms-conditions");
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

  const resendMutation = useMutation<
    ApiResponse,
    ApiResponseError,
    Pick<FormValue, "email">
  >({
    mutationFn: async (payload) =>
      postRequest("/auth/resend-activation-email/", payload),
    onSuccess(data) {
      if (typeof data.data.message === "string") {
        handler.success("Email Verification", data.data.message);
      }
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
    <Container
      noGutter
      as="section"
      isLoading={resendMutation.isPending}
      className="flex min-h-screen lg:mt-20 justify-center bg-background px-4 sm:px-6 lg:px-0"
    >
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
          <p className="mt-2 text-xl text-muted-foreground font-medium font-urbanist max-w-4xl">
            To complete your profile and start enjoying the most effective
            inventory management system, you’ll need to verify your email
            address.
          </p>
        </div>

        <ForgeForm onSubmit={mutate}>
          <div className="mb-10 gap-3 max-w-xl relative">
            <Forger
              component={TextInput}
              name="otp"
              containerClass="col-span-2"
              placeholder="One time password"
              helperText="Are you facing any problems with receiving the code? Click here to resend"
              startAdornment={
                <TextCursorInput className="h-5 w-5 mr-2 text-gray-400" />
              }
            />
            <span
              onClick={() =>
                resendMutation.mutate({ email: location.state?.email })
              }
              className="text-primary absolute right-[5.5rem] cursor-pointer -bottom-1"
            >
              Resend
            </span>
          </div>

          <div>
            <Button type="submit" variant={'default'} isLoading={isPending} className="w-60">
              Verify <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </ForgeForm>
      </div>
    </Container>
  );
};
