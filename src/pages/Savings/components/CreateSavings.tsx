import { DataTable } from "@/components/layouts/DataTable";
import { TextArea } from "@/components/layouts/FormInputs/TextArea";
import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { TextSelect } from "@/components/layouts/FormInputs/TextSelect";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToastHandlers } from "@/hooks/useToaster";
import { getRequest, patchRequest, postRequest } from "@/lib/axiosInstance";
import { Forger, useForge } from "@/lib/forge";
import { ProductList } from "@/pages/ProductInventory";
import { ApiListResponse, ApiResponse, ApiResponseError } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ColumnDef, RowData } from "@tanstack/react-table";
import {
  ArrowRight,
  MapPin,
  PiggyBank,
  Plus,
  RotateCcw,
  User,
  Clock,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Props {}
interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  duration_display: string;
  duration_days: number;
  is_active: boolean;
  total_products: number;
  total_items: number;
  total_value: string;
  created_at: Date;
  updated_at: Date;
  plan_products: any[];
}

type FormValue = {
  name: string;
  description: string;
  price: string;
  duration: string;
  duration_days: number;
};

type ProductPlanForm = {
  plan_products: {
    product: string;
    quantity: number;
    price: number;
  }[];
  planId: string;
};

type Order = {
  product: string;
  quantity: number;
  price: number;
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

function CreateSavingsPlan(props: Props) {
  const {} = props;
  const handler = useToastHandlers();
  const { ForgeForm } = useForge<FormValue>({});
  const [orders, setOrders] = useState<Order[]>([]);

  const { mutate: AddProductPlanMutate } = useMutation<
    ApiResponse,
    ApiResponseError,
    ProductPlanForm
  >({
    mutationFn: async (values) => {
      return await patchRequest(`/plans/${values.planId}/products/`, {
        plan_products: values.plan_products,
      });
    },
    onSuccess(data) {
      if (typeof data.data.message === "string") {
        handler.success("Savings Creation", data.data.message);
      }
    },
    onError(error) {
      handler.error("Savings Creation", error);
    },
  });

  const { mutate: createOrder } = useMutation<
    ApiResponse<Plan>,
    ApiResponseError,
    FormValue
  >({
    mutationFn: async (values) => {
      return await postRequest("/plans/", { ...values });
    },
    onSuccess(data) {
      if (typeof data.data.message === "string") {
        handler.success("Savings Creation", data.data.message);
      }
      AddProductPlanMutate({
        planId: data.data.data.id,
        plan_products: orders,
      });
    },
    onError(error) {
      handler.error("Savings Creation", error);
    },
  });

  const { data } = useQuery<
    ApiListResponse<ProductList[]>,
    ApiResponseError
  >({
    queryKey: ["products"],
    queryFn: async () => await getRequest("products/"),
  });

  const columns: ColumnDef<Order>[] = [
    {
      id: "S/N",
      header: "S/N",
      cell: ({ row: { index } }) => {
        return <div>{index + 1}</div>;
      },
    },
    {
      accessorKey: "product",
      header: "Product Name",
      meta: {
        inputType: "select",
        options:
          data?.data.results.data.map((item) => ({
            label: item.name,
            value: item.id,
          })) ?? [],
      },
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="rounded-full">
          <PiggyBank className="h-5 w-5 mr-2" />
          Create Food Plan
        </Button>
      </SheetTrigger>
      <SheetContent className="!max-w-xl">
        <SheetHeader>
          <SheetTitle>Create Food Plan</SheetTitle>
          <SheetDescription>
            <div className="mt-5">
              <h5 className="font-urbanist font-medium">
                Customer Information
              </h5>

              <ForgeForm onSubmit={createOrder} className="mt-3 mb-10">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Forger
                    name="name"
                    placeholder="Food Plan Name"
                    component={TextInput}
                    startAdornment={
                      <User className="h-5 w-5 mr-2 text-gray-400" />
                    }
                  />
                  <Forger
                    name="price"
                    placeholder="Price"
                    // label="Business "
                    component={TextInput}
                    type="number"
                    startAdornment={
                      <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Forger
                    name="duration"
                    placeholder="Duration"
                    component={TextSelect}
                    options={[
                      { label: "Daily", value: "daily" },
                      { label: "Weekly", value: "weekly" },
                      { label: "Monthly", value: "monthly" },
                      { label: "Quarterly", value: "quarterly" },
                      { label: "Yearly", value: "yearly" },
                    ]}
                    startAdornment={
                      <Clock className="h-5 w-5 mr-2 text-gray-400" />
                    }
                  />
                  <Forger
                    name="duration_days"
                    placeholder="Duration Days"
                    // label="Business Type"
                    component={TextInput}
                    startAdornment={
                      <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                    }
                  />
                </div>

                <Forger
                  name="description"
                  placeholder="description"
                  component={TextArea}
                />

                <h5 className="mt-5 font-urbanist font-medium">Order List</h5>

                <DataTable
                  data={orders}
                  config={{
                    defaultColumn: defaultColumn as any,
                    meta: {
                      updateData: (rowIndex, columnId, value) => {
                        setOrders((old) =>
                          old.map((row, index) => {
                            if (index === rowIndex) {
                              return {
                                ...old[rowIndex]!,
                                [columnId]: value,
                              };
                            }
                            return row;
                          })
                        );
                      },
                    },
                  }}
                  columns={columns as ColumnDef<unknown>[]}
                  options={{
                    disableSelection: true,
                    disablePagination: true,
                  }}
                />

                <div className="flex items-center justify-between gap-3">
                  <Button
                    size={"sm"}
                    variant={"outline"}
                    className="rounded-full"
                    onClick={() =>
                      setOrders((prev) => {
                        return [
                          ...prev,
                          {
                            product: "",
                            quantity: 0,
                            price: 0,
                          },
                        ];
                      })
                    }
                  >
                    Add Product
                    <Plus className="h-5 w-5 ml-2" />
                  </Button>

                  <Button
                    size={"sm"}
                    variant={"destructive"}
                    className="rounded-full"
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Reset
                  </Button>
                </div>

                <SheetFooter className="mt-20 items-end p-0">
                  <Button type={"submit"} className="w-fit">
                    Create Plan
                  </Button>
                  <ArrowRight className="h-5 w-5" />
                </SheetFooter>
              </ForgeForm>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default CreateSavingsPlan;

const defaultColumn: Partial<ColumnDef<Order>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    const [value, setValue] = useState(initialValue);
    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
    };
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

    // Get column definition and meta
    const columnMeta = table.getAllColumns().find((c) => c.id === id)?.columnDef
      ?.meta as {
      inputType?: string;
      options: { value: string; label: string }[];
    };
    const inputType = columnMeta?.inputType || "input";
    const options = columnMeta?.options || [];

    if (inputType === "select") {
      return (
        <select
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          className="w-fit min-w-[2rem]"
          onBlur={onBlur}
        >
          {options.map((option: { value: string; label: string }) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        className="w-fit min-w-[2rem]"
        onBlur={onBlur}
      />
    );
  },
};
