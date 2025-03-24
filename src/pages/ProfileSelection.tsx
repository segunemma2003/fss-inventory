import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { useForge } from "@/lib/forge/useForge";
import { ArrowRight, Lock } from "lucide-react";
import { Forger } from "@/lib/forge";
import { useNavigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRequest, postRequest } from "@/lib/axiosInstance";
import { useToastHandlers } from "@/hooks/useToaster";
import { ApiResponse, ApiResponseError, User, UserProfile } from "@/types";
// import { getLoginToken, getLoginUser } from "@/demo";
import { useSetReset, useSetToken, useSetUser } from "@/store/authSlice";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FeatureSection } from "./Register/layoout/FeatureSection";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { MapList } from "@/components/layouts/MapList";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";

type FormValue = {
  pin?: string;
  profile_id: string;
};

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  role: string;
}

const schema = yup.object().shape({
  pin: yup.string().optional(),
  profile_id: yup.string().required(),
});

export const ProfileSelection = () => {
  const setUser = useSetUser();
  const navigate = useNavigate();
  const setReset = useSetReset();
  const setToken = useSetToken();
  const handler = useToastHandlers();

  const { ForgeForm, control, setValue } = useForge<FormValue>({
    defaultValues: {
      profile_id: "",
    },
    resolver: yupResolver(schema),
  });

  const [profileId] = useWatch({ control, name: ["profile_id"] });

  const { data } = useQuery<ApiResponse<UserProfile[]>, ApiResponseError>({
    queryKey: ["user-profile"],
    queryFn: async () => await getRequest("profile/"),
    refetchOnWindowFocus: false,
  });

  const { mutate, isPending } = useMutation<
    ApiResponse<LoginResponse>,
    ApiResponseError,
    FormValue
  >({
    mutationFn: async (payload) =>
      postRequest("/auth/select-profile/", payload),
    onSuccess(data) {
      const { access_token, user, role } = data.data.data;

      setUser({ ...user, role });
      setToken(access_token);
      if (typeof data?.data?.message === "string") {
        handler.success("Authentication", data.data.message);
      }
    },
    onError(error) {
      handler.error("Registration", error);
    },
  });

  const isLocked = data?.data.data.find(
    (item) => item.id === profileId
  )?.is_locked;

  const onSignOut = () => {
    setReset();
    navigate("/login");
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
          <h2 className="text-2xl font-bold text-accent-foreground mb-3">
            Select Profile Account
          </h2>
        </div>

        <ForgeForm onSubmit={mutate} className="mt-8 space-y-6">
          <ScrollArea>
            <div className="max-h-60">
              <MapList
                data={data?.data?.data ?? []}
                renderItem={(item, index) => (
                  <ProfileItem
                    key={index}
                    id={item.id}
                    value={profileId}
                    email={item.email}
                    name={item.display_name}
                    isLocked={item.is_locked}
                    onChange={() => setValue("profile_id", item.id)}
                  />
                )}
              />
            </div>
          </ScrollArea>

          {isLocked && (
            <div className="space-y-4">
              <Forger
                component={TextInput}
                name="pin"
                placeholder="Enter profile pin"
                type="number"
                required
                startAdornment={<Lock className="h-5 w-5 mr-2" />}
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <Button type="submit" isLoading={isPending} className="w-fit mt-5">
              Proceed
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button onClick={onSignOut} variant={"ghost"} className="w-fit mt-5">
              Sign out
            </Button>
          </div>
        </ForgeForm>
      </div>
      <div className="flex-1">
        <FeatureSection />
      </div>
    </div>
  );
};

type ProfileItem = {
  id: string;
  name: string;
  value: string;
  email: string;
  isLocked: boolean;
  onChange: () => void;
};

const ProfileItem = ({
  name,
  email,
  isLocked,
  onChange,
  id,
  value,
}: ProfileItem) => {
  return (
    <Card onClick={onChange} className="max-w-xs py-2.5 px-3">
      <CardContent className="p-0">
        <div className="flex items-baseline gap-3">
          <div className="">
            <Checkbox checked={value === id} />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-base ">{name}</h2>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
          {isLocked && <Lock className="w-5 h-5 self-center mr-2" />}
        </div>
      </CardContent>
    </Card>
  );
};
