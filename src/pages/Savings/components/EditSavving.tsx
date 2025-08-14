import { ConfirmAlert } from "@/components/layouts/ConfirmAlert";
import { DataTable } from "@/components/layouts/DataTable";
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
import { patchRequest, postRequest } from "@/lib/axiosInstance";
import { Forger, useForge } from "@/lib/forge";
import { ApiResponse, ApiResponseError } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef, RowData } from "@tanstack/react-table";
import {
  ArrowRight,
  Edit,
  Plus,
  RotateCcw,
  Trash,
  User,
  Clock,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  id: string;
  name: string;
  price: string;
  duration: string;
  is_active: boolean;
  description: string;
  total_products: number;
  duration_display: string;
}

type FormValue = {
  name: string;
  description: string;
  price: string;
  duration: string;
  duration_days?: number;
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
  id?: string;
  product: string;
  quantity: number;
  price: number;
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

function EditSavingsPlan(props: Props) {
  const { description, duration, name, price, id } = props;

  const handler = useToastHandlers();
  const { ForgeForm } = useForge<FormValue>({
    defaultValues: {
      description,
      duration,
      name,
      price,
    },
  });
  const [orders, setOrders] = useState<Order[]>([]);

  const { mutate: AddProductPlanMutate } = useMutation<
    ApiResponse,
    ApiResponseError,
    ProductPlanForm
  >({
    mutationFn: async (values) => {
      return await postRequest(`/plans/${values.planId}/products/`, {
        plan_products: values.plan_products,
      });
    },
    onSuccess(data) {
      if (typeof data.data.message === "string") {
        handler.success("Edit Plan", data.data.message);
      }
    },
    onError(error) {
      handler.error("Edit Plan", error);
    },
  });

  const { mutate: createOrder } = useMutation<
  ApiResponse,
  ApiResponseError,
  FormValue
>({
  mutationFn: async (values) => {
    return await patchRequest(`/plans/${id}/`, { ...values });
  },
  onSuccess(data) {
    if (typeof data.data.message === "string") {
      handler.success("Edit Plan", data.data.message);
    }
    AddProductPlanMutate({ plan_products: orders, planId: id });
  },
  onError(error) {
    handler.error("Edit Plan", error);
  },
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
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      id: "action",
      header: "ACTION",
      cell: ({ row }) => {
        return (
          <ConfirmAlert
            text="Are you sure, you want to delete this product from plan?"
            url={`/plans/${id}/products/${row.original.id}/`}
            title={``}
            trigger={
              <Button size={"icon"} variant={"destructive"} className="">
                <Trash />
              </Button>
            }
          />
        );
      },
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={"icon"} variant={"ghost"} className="">
          <Edit />
        </Button>
      </SheetTrigger>
      <SheetContent className="!max-w-xl">
        <SheetHeader>
          <SheetTitle>Edit Savings</SheetTitle>
          <SheetDescription>
            <div className="mt-5">
              <h5 className="font-urbanist font-medium">
                Plan Information
              </h5>

              <ForgeForm onSubmit={createOrder} className="mt-3 mb-10">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Forger
                    name="name"
                    placeholder="Savings Name"
                    component={TextInput}
                    startAdornment={
                      <User className="h-5 w-5 mr-2 text-gray-400" />
                    }
                  />
                  <Forger
                    name="price"
                    placeholder="Price"
                    component={TextInput}
                    type="number"
                    startAdornment={
                      <Calendar className="h-5 w-5 mr-2 text-gray-400" />
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
                    component={TextInput}
                    type="number"
                    startAdornment={
                      <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                    }
                  />
                </div>

                

                <Forger
                  name="description"
                  placeholder="Description"
                  component={TextInput}
                  startAdornment={
                    <User className="h-5 w-5 mr-2 text-gray-400" />
                  }
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
                    Edit Plan
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </SheetFooter>
              </ForgeForm>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default EditSavingsPlan;

const defaultColumn: Partial<ColumnDef<Order>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);

    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);

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
