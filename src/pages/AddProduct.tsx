import { BackButton } from "@/components/layouts/BackButton";
import Container from "@/components/layouts/Container";
import {
  TextArea,
  TextFileUploader,
  TextInput,
  TextTagInput,
} from "@/components/layouts/FormInputs/TextInput";
import { TextSelect } from "@/components/layouts/FormInputs/TextSelect";
import { Button } from "@/components/ui/button";
import { useToastHandlers } from "@/hooks/useToaster";
import {
  getRequest,
  postRequest,
} from "@/lib/axiosInstance";
import { Forger, useForge, usePersist } from "@/lib/forge";
import { ApiResponse, ApiResponseError } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Package,
  Pencil,
  Layers2,
  SquareStack,
  CalendarPlus,
  Weight,
} from "lucide-react";
import { TbCurrencyNaira } from "react-icons/tb";
import axios from "axios";

type FormValue = {
  name: string;
  description: string;
  category: string;
  cost_price: string;
  selling_price: string;
  tags: { id: string; text: string }[];
  quantity: string;
  uom: string;
  image: string;
  expiry_date: string;
  imageSrc?: File[] | null;
};

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
    <div className="h-60 flex flex-col items-center justify-center">
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

type Category = {
  id: string;
  name: string;
  description: string;
};

export function AddProduct() {
  const { ForgeForm, reset, setValue, control } = useForge<FormValue>({
    defaultValues: {
      tags: [],
      imageSrc: null
    },
  });
  const handler = useToastHandlers();
  
  const categoryQuery = useQuery<ApiResponse<Category[]>, ApiResponseError>({
    queryKey: ["categories"],
    queryFn: async () => await getRequest("products/categories"),
  });

  const { mutate, isPending } = useMutation<
    ApiResponse<any>,
    ApiResponseError,
    Omit<FormValue, "tags" | "imageSrc"> & { tags: string[] }
  >({
    mutationFn: async (payload) => postRequest("/products/", payload),
    onSuccess(data) {
      if (typeof data.data.message === "string") {
        handler.success("Product", data.data.message);
      }
    },
    onError(error) {
      handler.error("Product", error);
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
            handler.error("Image Upload", "Invalid file input received");
            return;
          }

          if (!file) {
            handler.error("Image Upload", "No file selected");
            return;
          }

          console.log('Selected file:', { 
            name: file.name, 
            type: file.type, 
            size: file.size 
          });

          // Validate file type
          if (!file.type.startsWith('image/')) {
            handler.error("Image Upload", "Please select a valid image file");
            return;
          }

          // Validate file size (e.g., max 5MB)
          const maxSize = 5 * 1024 * 1024; // 5MB
          if (file.size > maxSize) {
            handler.error("Image Upload", "File size must be less than 5MB");
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
                      handler.success("Image Upload", "Image uploaded successfully");
                    },
                    onError: (error) => {
                      console.error('Upload error:', error);
                      handler.error(
                        "Image Upload", 
                        error.message || "Failed to upload image to storage"
                      );
                    },
                  }
                );
              },
              onError: (error) => {
                console.error('Presigned URL error:', error);
                handler.error(
                  "Presigned URL", 
                  error.message || "Failed to get upload permission"
                );
              },
            }
          );
        } catch (error) {
          console.error('Unexpected error during upload:', error);
          handler.error(
            "Image Upload", 
            error instanceof Error ? error.message : "An unexpected error occurred"
          );
        }
      }
    },
  });

  const handleSubmit = (data: FormValue) => {
    const tags = data.tags.map((item) => item.text);
    delete data.imageSrc;
    mutate({ ...data, tags });
  };

  const categories =
    categoryQuery.data?.data.data.map((item) => ({
      label: item.name,
      value: item.id,
    })) ?? [];

  return (
    <Container className="py-10">
      <div className="py-4 w-fit">
        <BackButton title="Back" />
      </div>

      <ForgeForm onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 mt-5 gap-4">
          <div className="space-y-6">
            <Forger
              name="imageSrc"
              component={TextFileUploader}
              onChange={(files: File[] | null) => setValue("imageSrc", files)}
              element={<FileUploadPlaceholder />}
            />
          </div>
          <div className="space-y-5">
            <Forger
              name="name"
              placeholder="Product Name"
              component={TextInput}
              startAdornment={<Package className="h-5 w-5 mr-2" />}
            />

            <div className="grid grid-cols-2 gap-3">
              <Forger
                name="cost_price"
                placeholder="Purchase Price"
                type="number"
                component={TextInput}
                className="appearance-none"
                startAdornment={<TbCurrencyNaira className="h-5 w-5 mr-2" />}
              />
              <Forger
                name="selling_price"
                placeholder="Selling Price"
                type="number"
                component={TextInput}
                className="appearance-none"
                startAdornment={<TbCurrencyNaira className="h-5 w-5 mr-2" />}
              />
            </div>

            <Forger
              name="expiry_date"
              placeholder="Date Added"
              type="date"
              component={TextInput}
              startAdornment={<CalendarPlus className="h-5 w-5 mr-2" />}
            />

            <div className="grid grid-cols-2 gap-3">
              <Forger
                name="quantity"
                placeholder="Product Quantity"
                component={TextInput}
                type="number"
                className="appearance-none"
                startAdornment={<SquareStack className="h-5 w-5 mr-2" />}
              />
              <Forger
                name="uom"
                placeholder="Unit of Measurement e.g Bag, basket, carton etc"
                component={TextInput}
                startAdornment={<Weight className="h-5 w-5 mr-2" />}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Forger
                name="tags"
                placeholder="Tags"
                component={TextTagInput}
                startAdornment={<Pencil className="h-5 w-5 mr-2" />}
              />
              <Forger
                name="category"
                placeholder="Category"
                component={TextSelect}
                options={categories}
                startAdornment={<Layers2 className="h-5 w-5 mr-2" />}
              />
            </div>

            <Forger
              name="description"
              placeholder="Product Description"
              component={TextArea}
              startAdornment={<Package className="h-5 w-5 mr-2" />}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-8">
          <Button variant={"secondary"} onClick={() => reset()}>
            Discard Changes
          </Button>
          <Button type="submit" isLoading={isPending}>
            Add Product
          </Button>
        </div>
      </ForgeForm>
    </Container>
  );
}
