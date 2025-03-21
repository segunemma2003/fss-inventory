/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { Forger, useForge } from "@/lib/forge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  // SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { forwardRef, useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRequest, postRequest } from "@/lib/axiosInstance";
import { useToastHandlers } from "@/hooks/useToaster";
import { AxiosError } from "axios";
import { ApiResponseError, ApiResponse } from "@/types";
import Role from "@/pages/Roles";
import { User2 } from "lucide-react";
interface NewMemberProps {
  className?: string;
}

const NewMemberSchema = z
  .object({
    full_name: z.string(),
    email: z.string().email().trim(),
    role_id: z.string(),
    display_name: z.string(),
    pin: z.string(),
  })
  .required();

type NewMemberFormValues = {
  full_name: string;
  email: string;
  role_id: string;
  pin: string;
  display_name: string;
};

export const AddNewMember = forwardRef<
  HTMLButtonElement | null,
  NewMemberProps
>(({ className }, ref) => {
  const { data } = useQuery<ApiResponse<{ roles: Role[] }>, ApiResponseError>({
    queryKey: ["roles"],
    queryFn: async () => await getRequest("auth/roles"),
  });

  const { ForgeForm, reset } = useForge<NewMemberFormValues>({
    defaultValues: {},
    resolver: zodResolver(NewMemberSchema),
  });

  const [open, setOpen] = useState(false);

  const toastHandlers = useToastHandlers();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: NewMemberFormValues) => {
      const resp = await postRequest(`profile/`, payload);
      return resp;
    },
    onError: (error: AxiosError) => {
      const err = error?.response as any;
      toastHandlers.error("Team members", err);
    },
    onSuccess: (data) => {
      toastHandlers.success("Team Members", data?.data?.message);
      reset();
      queryClient.invalidateQueries({ queryKey: ["teamMembers"] });
      setOpen(false);
    },
  });
  const handleSubmit = async (values: NewMemberFormValues) => {
    // console.log(values);
    await mutateAsync(values);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={() => setOpen(!open)}>
        <DialogTrigger className={className} ref={ref} asChild>
          <Button className="rounded-full">
            <User2 className="w-5 h-5 mr-3" />
            Create Profile
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>Add Member</DialogTitle>
          </DialogHeader>

          <ForgeForm onSubmit={handleSubmit} className="space-y-3">
            <Forger
              name="full_name"
              label="Full Name"
              component={TextInput}
              containerClass=""
            />
            <Forger
              name="display_name"
              label="Display Name"
              component={TextInput}
              containerClass=""
            />
            <Forger
              rows={5}
              name="email"
              label="Email Address"
              component={TextInput}
              containerClass=""
            />

            <Forger
              rows={5}
              name="pin"
              label="Pin"
              component={TextInput}
              containerClass=""
            />

            <Forger
              name="role_id"
              component={(props: {
                containerClass: string | undefined;
                onChange: any;
                value: string;
              }) => (
                <Select
                  onValueChange={props.onChange}
                  defaultValue={props?.value}
                >
                  {/* <SelectLabel>Role</SelectLabel> */}
                  <SelectTrigger className={props?.containerClass}>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="my-2">
                    {data?.data.data?.roles.map((role) => {
                      return (
                        <SelectItem value={role?.id} key={role?.id}>
                          {role?.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
              containerClass="mb-3"
            />

            <Button type="submit" className="w-full mt-3" isLoading={isPending}>
              Add Member
            </Button>
          </ForgeForm>
        </DialogContent>
      </Dialog>
    </>
  );
});
