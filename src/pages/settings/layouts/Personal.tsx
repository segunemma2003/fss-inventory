import { ImageUploader } from "../components/imageUploader";
import { useUser } from "@/store/authSlice";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse, ApiResponseError, UserProfile } from "@/types";
import { getRequest } from "@/lib/axiosInstance";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarIcon,
  HomeIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { FaRegEdit } from "react-icons/fa";
import { EditProfileDialog } from "../components/EditProfileDialog";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { patchRequest } from "@/lib/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import { useToastHandlers } from "@/hooks/useToaster";

type PresignedURL = { filename: string; contentType: string };

export function Personal() {
  const user = useUser();
  const [_, setProfilePicUrl] = useState<string | null>(null);
  const handler = useToastHandlers();
  const queryClient = useQueryClient();

  // Presigned URL mutation (copied from AddProduct)
  const presignedUrlMutation = useMutation({
    mutationFn: async ({ filename, contentType }: PresignedURL) => {
      const response = await axios.post(
        "https://u277qmqy4dadbxjin25cumism40pngjj.lambda-url.us-east-2.on.aws",
        { filename, content_type: contentType },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    },
  });

  // Upload mutation (copied from AddProduct)
  const uploadMutation = useMutation({
    mutationFn: async ({
      url,
      file,
      contentType,
    }: {
      url: string;
      file: File;
      contentType: string;
    }) => {
      await axios.put(url, file, {
        headers: { "Content-Type": contentType },
        timeout: 30000,
      });
    },
  });

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { profile_picture: string }) => {
      if (!user?.profileId) throw new Error("Profile ID not found");
      return await patchRequest(`profile/${user.profileId}/`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile-details"] });
      handler.success(
        "Profile Updated",
        "Profile picture updated successfully"
      );
    },
    onError: (error: any) => {
      handler.error(
        "Profile Update",
        error.message || "Failed to update profile picture"
      );
    },
  });

  const handleProfileImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      handler.error("Image Upload", "Please select a valid image file");
      return;
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      handler.error("Image Upload", "File size must be less than 5MB");
      return;
    }
    presignedUrlMutation.mutate(
      { filename: file.name, contentType: file.type },
      {
        onSuccess: (data) => {
          uploadMutation.mutate(
            { url: data.upload_url, file, contentType: file.type },
            {
              onSuccess: () => {
                setProfilePicUrl(data.object_url);
                handler.success(
                  "Image Upload",
                  "Profile picture uploaded successfully"
                );
                // Immediately update profile with new picture
                updateProfileMutation.mutate({
                  profile_picture: data.object_url,
                });
              },
              onError: (error: any) => {
                handler.error(
                  "Image Upload",
                  error.message || "Failed to upload image"
                );
              },
            }
          );
        },
        onError: (error: any) => {
          handler.error(
            "Presigned URL",
            error.message || "Failed to get upload permission"
          );
        },
      }
    );
  };

  const { data, isLoading } = useQuery<
    ApiResponse<UserProfile>,
    ApiResponseError
  >({
    queryKey: ["profile-details", user?.profileId],
    queryFn: async () => {
      if (!user?.profileId) throw new Error("Profile ID not found");
      return await getRequest(`profile/${user.profileId}/`);
    },
    enabled: !!user?.profileId,
    refetchOnWindowFocus: false,
  });

  const profile = data?.data?.data;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Profile Header with Image */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 h-48">
        <div className="absolute -bottom-16 left-8">
          {isLoading ? (
            <Skeleton className="h-32 w-32 rounded-full border-4 border-white" />
          ) : (
            <ImageUploader
              className="h-32 w-32 rounded-full border-4 border-white"
              onImageUpload={handleProfileImageUpload}
            />
          )}
        </div>
        <div className="absolute top-4 right-4">
          <EditProfileDialog
            profile={profile}
            trigger={
              <Button
                variant="ghost"
                className="bg-white/20 hover:bg-white/30 text-white rounded-full"
              >
                <FaRegEdit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            }
          />
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 px-8 pb-8">
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900">
              {profile?.display_name || "User"}
            </h1>
            <p className="text-gray-500 mb-6">
              {profile?.is_locked ? "Secured Account" : "Standard Account"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoCard
                icon={<UserIcon className="h-5 w-5 text-blue-500" />}
                label="Full Name"
                value={profile?.full_name || "Not provided"}
              />

              <InfoCard
                icon={<MailIcon className="h-5 w-5 text-blue-500" />}
                label="Email Address"
                value={profile?.email || "Not provided"}
              />

              <InfoCard
                icon={<PhoneIcon className="h-5 w-5 text-blue-500" />}
                label="Phone Number"
                value={profile?.phone_number || "Not provided"}
              />

              <InfoCard
                icon={<HomeIcon className="h-5 w-5 text-blue-500" />}
                label="Address"
                value={profile?.address || "Not provided"}
              />

              <InfoCard
                icon={<CalendarIcon className="h-5 w-5 text-blue-500" />}
                label="Joined"
                value={
                  profile?.created_at
                    ? format(new Date(profile.created_at), "PPP")
                    : "Unknown"
                }
              />

              <InfoCard
                icon={<CalendarIcon className="h-5 w-5 text-blue-500" />}
                label="Last Updated"
                value={
                  profile?.updated_at
                    ? format(new Date(profile.updated_at), "PPP")
                    : "Unknown"
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

type InfoCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

const InfoCard = ({ icon, label, value }: InfoCardProps) => {
  return (
    <div className="flex items-start p-4 rounded-lg border border-gray-100 bg-gray-50">
      <div className="mr-4">{icon}</div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{label}</h3>
        <p className="text-gray-900">{value}</p>
      </div>
    </div>
  );
};

const ProfileSkeleton = () => {
  return (
    <>
      <Skeleton className="h-8 w-40 mb-2" />
      <Skeleton className="h-4 w-28 mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex items-start p-4 rounded-lg border border-gray-100 bg-gray-50"
          >
            <Skeleton className="h-5 w-5 mr-4" />
            <div className="w-full">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-5 w-28" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
