import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError, UserProfile } from "@/types";
import { useToastHandlers } from "@/hooks/useToaster";
import { useUser } from "@/store/authSlice";
import { Lock, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useForge } from "@/lib/forge/useForge";
import { Forger } from "@/lib/forge";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { FormPropsRef } from "@/lib/forge/useForge/useForge";

type ProfileFormData = {
  full_name: string;
  address?: string;
  email: string;
  phone_number?: string;
  display_name: string;
  pin: string;
};

type EditProfileDialogProps = {
  profile: UserProfile | undefined;
  trigger?: React.ReactNode;
};

// Validation schema
const schema = yup.object().shape({
  full_name: yup.string(),
  address: yup.string(),
  email: yup.string().email("Must be a valid email").required("Email is required"),
  phone_number: yup.string(),
  display_name: yup.string().required("Display name is required"),
  pin: yup.string()
    .required("PIN is required")
    .matches(/^\d{4}$/, "PIN must be exactly 4 digits")
});

export function EditProfileDialog({ profile, trigger }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const user = useUser();
  const queryClient = useQueryClient();
  const toast = useToastHandlers();
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<FormPropsRef>(null);

  const { ForgeForm, setValue } = useForge<ProfileFormData>({
    defaultValues: {
      full_name: "",
      address: "",
      email: "",
      phone_number: "",
      display_name: "",
      pin: "",
    },
    resolver: yupResolver(schema),
  });

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setValue("full_name", profile.full_name || "");
      setValue("address", profile.address || "");
      setValue("email", profile.email || "");
      setValue("phone_number", profile.phone_number || "");
      setValue("display_name", profile.display_name || "");
    }
  }, [profile, setValue]);

  // Reset form when dialog opens/closes
  useEffect(() => {
    setError(null);
    if (!open) {
      setValue("pin", ""); // Clear PIN when dialog closes
    }
  }, [open, setValue]);

  const { mutate, isPending } = useMutation<
    ApiResponse<UserProfile>,
    ApiResponseError,
    ProfileFormData
  >({
    mutationFn: async (data) => {
      if (!user?.profileId) throw new Error("Profile ID not found");
      return await patchRequest(`profile/${user.profileId}/`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-details"] });
      toast.success("Profile Updated", "Your profile has been updated successfully");
      setOpen(false);
    },
    onError: (error) => {
      if (error.response?.data?.message) {
        if (typeof error.response.data.message === 'string') {
          setError(error.response.data.message);
        } else {
          setError("An error occurred while updating your profile");
        }
      } else {
        setError("An error occurred while updating your profile");
      }
      toast.error("Update Failed", error);
    },
  });

  const handleSubmit = (data: ProfileFormData) => {
    // Remove empty fields to make them optional
    const payload = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== "")
    );
    
    mutate(payload as ProfileFormData);
  };

  const submitForm = () => {
    formRef.current?.onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">Edit Profile</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile information here.
            {profile?.is_locked && (
              <span className="mt-2 flex items-center text-amber-600">
                <Lock className="h-3 w-3 mr-1" /> This profile is locked and requires a PIN for changes.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <ForgeForm ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Forger
            component={TextInput}
            name="display_name"
            label="Display Name"
            required
          />
          
          <Forger
            component={TextInput}
            name="full_name"
            label="Full Name"
          />
          
          <Forger
            component={TextInput}
            name="email"
            label="Email"
            type="email"
            required
          />
          
          <Forger
            component={TextInput}
            name="phone_number"
            label="Phone"
          />
          
          <Forger
            component={TextInput}
            name="address"
            label="Address"
          />
          
          <div className="relative">
            <Forger
              component={TextInput}
              name="pin"
              label="PIN (4 digits)"
              type="password"
              inputMode="numeric"
              placeholder="Required for changes"
              pattern="[0-9]{4}"
              maxLength={4}
              required
              startAdornment={profile?.is_locked ? <Lock className="h-4 w-4 mr-1" /> : undefined}
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="mt-2 sm:mt-0"
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={submitForm} 
              isLoading={isPending}
            >
              Save changes
            </Button>
          </DialogFooter>
        </ForgeForm>
      </DialogContent>
    </Dialog>
  );
} 