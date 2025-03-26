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
  externalUploadRequest,
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
  imageSrc?: any;
};

export interface ImageResponse {
  status: string;
  location: string;
  size: string;
  type: string;
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

  const uploadMutation = useMutation<
    ApiResponse<ImageResponse>,
    ApiResponseError,
    FormData
  >({
    mutationKey: ["image-upload"],
    mutationFn: async (payload) =>
      await externalUploadRequest(
        "engine/upload/",
        payload,
        "https://devapi.autogon.ai/api/v1/"
      ),
    onSuccess(data) {
      const url = data.data.data.location;
      setValue("image", url);
    },
    onError(error) {
      handler.error("Image Upload", error);
    },
  });

  usePersist({
    control,
    handler(payload, formState) {
      if (formState.name === "imageSrc" && formState.type === "change") {
        const formData = new FormData();
        formData.append("file", payload[formState.name]);
        uploadMutation.mutate(formData);
        return;
      }
    },
  });

  const handleSubmit = (data: FormValue) => {
    const tags = data.tags.map((item) => item.text);

    delete data.imageSrc;

    mutate({ ...data, tags, image: uploadMutation.data?.data.data.location ?? '' });
  }

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
