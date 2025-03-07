"use client";
import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { postRequest } from "@/lib/axiosInstance";
import { Forger, useForge } from "@/lib/forge";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import * as React from "react";
import { useNavigate } from "react-router";

type FormValues = {
  email: string;
};

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { ForgeForm } = useForge<FormValues>({
    defaultValues: {
      email: "",
    },
  });

  const { isPending } = useMutation({
    mutationFn: async (payload) => postRequest("", payload),
  });

  const handleSubmit = (data: FormValues) => {
    console.log("Verifying email:", data);
  };

  return (
    <section className="flex overflow-hidden flex-col items-center px-20 pt-16 bg-white pb-[514px] max-md:px-5 max-md:pb-24">
      <div className="flex flex-col items-start w-full max-w-[1200px] max-md:max-w-full">
        <header className="flex flex-wrap gap-10 justify-between items-center self-stretch max-md:max-w-full">
          <div className="flex overflow-hidden flex-col justify-center items-start self-stretch px- py-7 my-auto bg-white min-w-60 w-[300px] max-md:px-5">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/877fbded3c1141a18415be7a6b510b08/a1b8d17c054ef5d488ceefa5dd92f6dac50b4fdb1ceb3d816f63c57dcff44ae5?placeholderIfAbsent=true"
              alt="Company Logo"
              className="object-contain aspect-[3.6] w-[216px]"
            />
          </div>
          <Button
            onClick={() => navigate(-1)}
            size={"icon"}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </header>

        <section className="mt-12 leading-tight max-md:mt-10 max-md:max-w-full">
          <h1 className="text-4xl font-bold text-red-600 max-md:max-w-full font-urbanist">
            Have you forgotten your password?
          </h1>
          <p className="mt-5 text-xl font-light tracking-tight text-neutral-700 max-md:max-w-full">
            Oops! Let's get you signed back in. Kindly provide your registered
            email address to your account to get a verification link
          </p>
        </section>

        <ForgeForm onSubmit={handleSubmit} className="w-full mt-5">
          <Forger
            component={TextInput}
            required
            name="email"
            containerClass="lg:w-[80%]"
            label="Email Address"
            placeholder="Enter your email address"
            type="email"
            autoComplete="email"
            startAdornment={<Mail className="h-5 w-5 mr-2" />}
          />

          <p className="mt-2 mb-11 text-sm font-medium tracking-tight leading-tight text-neutral-500 max-md:max-w-full">
            A link will be sent to this email address, click the link to verify
            your account.
          </p>

          <Button isLoading={isPending} variant={"default"} className="w-60">
            <span className="self-stretch my-auto">
              {isPending ? "Verifying..." : "Verify"}
            </span>
            <ArrowRight className="h-5 w-5 ml-3" />
          </Button>
        </ForgeForm>
      </div>
    </section>
  );
};

export default ForgotPassword;

const VerificationSuccessDialog = () => {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Check your mailbox</DialogTitle>
        </DialogHeader>

        <div className="text-center">
          <p className="text-sm text-neutral-500">
            A verification link has been sent to the email address you provided.
            Check your mail box and get signed in.
          </p>
        </div>

        <Button className="w-80">
          Continue  <ArrowRight className="h-5 w-5 ml-3" />
        </Button>
      </DialogContent>
    </Dialog>
  );
};
