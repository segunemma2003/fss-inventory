import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  TextArea,
  TextInput,
  TextFileUploader,
  FileSvgDraw,
} from "@/components/layouts/FormInputs/TextInput";
import { useToastHandlers } from "@/hooks/useToaster";
import { postRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Forger, useForge, usePersist } from "@/lib/forge";
import axios from "axios";

interface PresignedUrlResponse {
  upload_url: string;
  upload_method: string;
  upload_headers: {
    "Content-Type": string;
  };
  object_url: string;
}

type FormValue = {
  name: string;
  description: string;
  image?: string;
  imageSrc?: File[] | null;
};

export const CategoryDialog = () => {
  const [open, setOpen] = useState(false);
  const { success, error } = useToastHandlers();
  const queryClient = useQueryClient();
  const { ForgeForm, setValue, control } = useForge<FormValue>({
    defaultValues: {
      name: "",
      description: "",
      image: "",
      imageSrc: null,
    },
  });

  const presignedUrlMutation = useMutation<
    PresignedUrlResponse,
    Error,
    { filename: string; contentType: string }
  >({
    mutationFn: async ({ filename, contentType }) => {
      try {
        console.log('Requesting presigned URL for:', { filename, contentType });
        const response = await axios.post(
          "https://u277qmqy4dadbxjin25cumism40pngjj.lambda-url.us-east-2.on.aws",
          { filename, content_type: contentType },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        console.log('Presigned URL response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error getting presigned URL:', error);
        throw error;
      }
    },
  });

  const uploadMutation = useMutation<void, Error, { url: string; file: File; contentType: string }>({
    mutationFn: async ({ url, file, contentType }) => {
      try {
        console.log('Uploading file to:', url);
        console.log('Upload headers:', { 'Content-Type': contentType });
        const response = await axios.put(url, file, {
          headers: {
            'Content-Type': contentType
          },
          timeout: 30000
        });
        console.log('Upload response:', response);
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
    },
  });

  usePersist({
    control,
    handler(payload, formState) {
      if (formState.name === "imageSrc" && formState.type === "change") {
        try {
          const fileInput = payload[formState.name];
          let file: File;
          
          if (Array.isArray(fileInput) && fileInput.length > 0) {
            file = fileInput[0];
          } else if (fileInput instanceof FileList) {
            file = fileInput[0];
          } else if (fileInput instanceof File) {
            file = fileInput;
          } else {
            console.error('Invalid file input:', fileInput);
            error("Image Upload", "Invalid file input received");
            return;
          }

          if (!file) {
            error("Image Upload", "No file selected");
            return;
          }

          console.log('Selected file:', { 
            name: file.name, 
            type: file.type, 
            size: file.size 
          });

          // Validate file type
          if (!file.type.startsWith('image/')) {
            error("Image Upload", "Please select a valid image file");
            return;
          }

          // Validate file size (e.g., max 5MB)
          const maxSize = 5 * 1024 * 1024; // 5MB
          if (file.size > maxSize) {
            error("Image Upload", "File size must be less than 5MB");
            return;
          }

          const filename = file.name;
          const contentType = file.type;

          presignedUrlMutation.mutate(
            { filename, contentType },
            {
              onSuccess: (data) => {
                console.log('Got presigned URL:', data.upload_url);
                uploadMutation.mutate(
                  {
                    url: data.upload_url,
                    file,
                    contentType,
                  },
                  {
                    onSuccess: () => {
                      console.log('Upload successful, setting image URL:', data.object_url);
                      setValue("image", data.object_url);
                      success("Image Upload", "Image uploaded successfully");
                    },
                    onError: (err) => {
                      console.error('Upload error:', err);
                      error(
                        "Image Upload", 
                        err.message || "Failed to upload image to storage"
                      );
                    },
                  }
                );
              },
              onError: (err) => {
                console.error('Presigned URL error:', err);
                error(
                  "Presigned URL", 
                  err.message || "Failed to get upload permission"
                );
              },
            }
          );
        } catch (err) {
          console.error('Unexpected error during upload:', err);
          error(
            "Image Upload", 
            err instanceof Error ? err.message : "An unexpected error occurred"
          );
        }
      }
    },
  });

  const mutation = useMutation<ApiResponse, ApiResponseError, FormValue>({
    mutationFn: async (data) => {
      const payload = {
        name: data.name,
        description: data.description,
        image: data.image || ""
      };
      
      const response = await postRequest("products/categories/", payload);
      return response.data;
    },
    onSuccess: () => {
      success("Success", "Category created successfully");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => {
      error("Error", err);
    },
  });

  const handleSubmit = (values: FormValue) => {
    if (!values.name.trim()) {
      error("Error", "Category name is required");
      return;
    }
    delete values.imageSrc;
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full">
          <Plus className="w-5 h-5 mr-3" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>
            Add a new category for organizing products
          </DialogDescription>
        </DialogHeader>
        <ForgeForm onSubmit={handleSubmit} className="space-y-4">
          <Forger
            name="name"
            component={TextInput}
            placeholder="Enter category name"
          />
          <Forger
            name="description"
            component={TextArea}
            placeholder="Enter category description (optional)"
            rows={4}
          />
          <Forger
            name="imageSrc"
            component={TextFileUploader}
            onChange={(files: File[] | null) => setValue("imageSrc", files)}
            element={<FileSvgDraw />}
          />
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={mutation.isPending}>
              Create Category
            </Button>
          </div>
        </ForgeForm>
      </DialogContent>
    </Dialog>
  );
};
