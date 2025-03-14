import { BackButton } from "@/components/layouts/BackButton";
import Container from "@/components/layouts/Container";
import {
  TextArea,
  TextFileUploader,
  TextInput,
} from "@/components/layouts/FormInputs/TextInput";
import { Button } from "@/components/ui/button";
import { useToastHandlers } from "@/hooks/useToaster";
import { postRequest } from "@/lib/axiosInstance";
import { Forger, useForge } from "@/lib/forge";
import { ApiResponse, ApiResponseError } from "@/types";
import { useMutation } from "@tanstack/react-query";
import {
  Package,
  Pencil,
  Layers2,
  SquareStack,
  BellRing,
  CalendarClock,
  CalendarPlus,
} from "lucide-react";
import { TbCurrencyNaira } from "react-icons/tb";

type FormValue = {
  email: string;
  password: string;
};

const FileUploadPlaceholder = () => {
  return (
    <div className="h-60 flex flex-col items-center justify-center">
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
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
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold text-primary">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        SVG, PNG, JPG or GIF
      </p>
    </div>
  );
};

export function AddProduct() {
  const { ForgeForm } = useForge<FormValue>({});
  const handler = useToastHandlers();

  const { mutate, isPending } = useMutation<
    ApiResponse<any>,
    ApiResponseError,
    FormValue
  >({
    mutationFn: async (payload) => postRequest("/auth/login", payload),
    onSuccess(data) {
      handler.success("Authentication", data.data.message);
    },
    onError(error) {
      handler.error("Registration", error);
    },
  });

  return (
    <Container className="py-10">
      <div className="py-4">
        <BackButton title="Back" />
      </div>
      <ForgeForm onSubmit={mutate}>
        <div className="grid grid-cols-2 mt-5 gap-4">
          <div>
            <Forger
              name="productImage"
              component={TextFileUploader}
              element={<FileUploadPlaceholder />}
            />
          </div>
          <div className="space-y-5">
            <Forger
              name="productName"
              placeholder="Product Name"
              component={TextInput}
              startAdornment={<Package className="h-5 w-5 mr-2" />}
            />
            <div className="grid grid-cols-2 gap-3">
              <Forger
                name="productID"
                placeholder="Product ID"
                component={TextInput}
                startAdornment={<Pencil className="h-5 w-5 mr-2" />}
              />
              <Forger
                name="category"
                placeholder="Category"
                component={TextInput}
                startAdornment={<Layers2 className="h-5 w-5 mr-2" />}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Forger
                name="purchasePrice"
                placeholder="Purchase Price"
                component={TextInput}
                startAdornment={<TbCurrencyNaira className="h-5 w-5 mr-2" />}
              />
              <Forger
                name="sellingPrice"
                placeholder="Selling Price"
                component={TextInput}
                startAdornment={<TbCurrencyNaira className="h-5 w-5 mr-2" />}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Forger
                name="productQuantity"
                placeholder="Product Quantity"
                component={TextInput}
                startAdornment={<SquareStack className="h-5 w-5 mr-2" />}
              />
              <Forger
                name="alertThreshold"
                placeholder="Alert Threshold"
                component={TextInput}
                startAdornment={<BellRing className="h-5 w-5 mr-2" />}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Forger
                name="shelfLife"
                placeholder="Shelf Life"
                component={TextInput}
                startAdornment={<CalendarClock className="h-5 w-5 mr-2" />}
              />
              <Forger
                name="dateAdded"
                placeholder="Date Added"
                type="date"
                component={TextInput}
                startAdornment={<CalendarPlus className="h-5 w-5 mr-2" />}
              />
            </div>

            <Forger
              name="productDescription"
              placeholder="Product Description"
              component={TextArea}
              startAdornment={<Package className="h-5 w-5 mr-2" />}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-8">
          <Button variant={"secondary"}>Discard Changes</Button>
          <Button type="submit" isLoading={isPending}>Add Product</Button>
        </div>
      </ForgeForm>
    </Container>
  );
}

// <FileSvgDraw />
