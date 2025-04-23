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
} from "@/components/layouts/FormInputs/TextInput";
import { useToastHandlers } from "@/hooks/useToaster";
import { patchRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError, ProductData } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
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

const FileUploadPlaceholder = () => {
  return (
    <div className="h-40 flex flex-col items-center justify-center">
      <svg
        className="w-8 h-8 mb-3 text-muted-foreground"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-muted-foreground">
        <span className="font-semibold text-primary">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF</p>
    </div>
  );
};

type FormValue = {
  name: string;
  description: string;
  cost_price: string;
  selling_price: string;
  quantity: string;
  uom: string;
  image: string;
  imageSrc?: File[] | null;
};

interface UpdateProductDialogProps {
  product: ProductData;
}

export const UpdateProductDialog = ({ product }: UpdateProductDialogProps) => {
  const [open, setOpen] = useState(false);
  const { success, error } = useToastHandlers();
  const queryClient = useQueryClient();
  
  const { ForgeForm, setValue, control, setError } = useForge<FormValue>({
    defaultValues: {
      name: product.name,
      description: product.description || "",
      cost_price: product.cost_price?.toString() || "",
      selling_price: product.selling_price?.toString() || "",
      quantity: product.quantity?.toString() || "",
      uom: product.uom || "",
      image: product.image || "",
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
                        err instanceof Error ? err.message : "Failed to upload image to storage"
                      );
                    },
                  }
                );
              },
              onError: (err) => {
                console.error('Presigned URL error:', err);
                error(
                  "Presigned URL", 
                  err instanceof Error ? err.message : "Failed to get upload permission"
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
        cost_price: data.cost_price ? parseFloat(data.cost_price) : null,
        selling_price: parseFloat(data.selling_price),
        quantity: parseInt(data.quantity),
        uom: data.uom,
        image: data.image,
      };
      
      const response = await patchRequest(`products/${product.id}/`, payload);
      return response.data;
    },
    onSuccess: () => {
      success("Success", "Product updated successfully");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => {
      // Handle field-specific validation errors
      if (err.response?.data?.data) {
        const fieldErrors = err.response.data.data;
        Object.entries(fieldErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            setError(field as keyof FormValue, {
              message: messages[0],
            });
          }
        });
      }
      
      // Always show the general error message
      error("Error", err);
    },
  });

  const handleSubmit = (values: FormValue) => {
    if (!values.name.trim()) {
      setError("name", {
        message: "Product name is required",
      });
      return;
    }
    delete values.imageSrc;
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
          <DialogDescription>
            Update the details for {product.name}
          </DialogDescription>
        </DialogHeader>
        <ForgeForm onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Forger
                name="imageSrc"
                component={TextFileUploader}
                onChange={(files: File[] | null) => setValue("imageSrc", files)}
                element={<FileUploadPlaceholder />}
              />
              {control._formValues.image && (
                <div className="mt-2">
                  <img 
                    src={control._formValues.image} 
                    alt="Product" 
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>
            <div className="space-y-4">
              <Forger
                name="name"
                component={TextInput}
                label="Product Name"
                placeholder="Enter product name"
              />
              <Forger
                name="description"
                component={TextArea}
                label="Description"
                placeholder="Enter product description (optional)"
                rows={4}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Forger
              name="cost_price"
              component={TextInput}
              label="Cost Price"
              type="number"
              placeholder="Enter cost price"
            />
            <Forger
              name="selling_price"
              component={TextInput}
              label="Selling Price"
              type="number"
              placeholder="Enter selling price"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Forger
              name="quantity"
              component={TextInput}
              label="Quantity"
              type="number"
              placeholder="Enter quantity"
            />
            <Forger
              name="uom"
              component={TextInput}
              label="Unit of Measurement"
              placeholder="Enter UOM"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={mutation.isPending}>
              Update Product
            </Button>
          </div>
        </ForgeForm>
      </DialogContent>
    </Dialog>
  );
}; 