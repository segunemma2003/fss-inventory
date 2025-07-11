import { DataTable } from "@/components/layouts/DataTable";
import { TextArea } from "@/components/layouts/FormInputs/TextArea";
import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToastHandlers } from "@/hooks/useToaster";
import { postRequest } from "@/lib/axiosInstance";
import { Forger, useForge } from "@/lib/forge";
import { ApiResponse, ApiResponseError } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, RowData } from "@tanstack/react-table";
import React from "react";
import {
  ArrowRight,
  MapPin,
  Package,
  Phone,
  Plus,
  RotateCcw,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Props {}
type FormValue = {
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  payment_method: string;
  payment_source: string;
  business: null;
  status: string;
  notes: string;
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

function CreateCustomOrder(props: Props) {
  const {} = props;
  const handler = useToastHandlers();
  const { ForgeForm } = useForge<FormValue>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const queryClient = useQueryClient();
  const closeRef = React.useRef<HTMLButtonElement>(null);

  const { mutate: createOrder, isPending } = useMutation<
    ApiResponse,
    ApiResponseError,
    FormValue
  >({
    mutationFn: async (values) => {
      return await postRequest("/orders/custom/", { ...values, items: orders });
    },
    onSuccess(data) {
      if (typeof data.data.message === "string") {
        handler.success("Custom Order Creation", data.data.message);
        // Invalidate the customOrders query to trigger a refetch
        queryClient.invalidateQueries({ queryKey: ["customOrders"] });
        // Reset the order form
        setOrders([]);
        // Close the sheet
        if (closeRef.current) {
          closeRef.current.click();
        }
      }
    },
    onError(error) {
      handler.error("Custom Order Creation", error);
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
      accessorKey: "name",
      header: "Product Name",
    },
    {
      accessorKey: "description",
      header: "Description",
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
      id: "actions",
      header: "Actions",
      cell: ({ row: { index } }) => {
        return (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => {
              setOrders((prev) => prev.filter((_, i) => i !== index));
            }}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="rounded-full">
          <Package className="h-5 w-5 mr-2" />
          Create Custom Order
        </Button>
      </SheetTrigger>
      <SheetContent className="!max-w-xl overflow-auto">
        <SheetHeader>
          <SheetTitle>Create New Custom Order</SheetTitle>
        </SheetHeader>
        <SheetDescription>
          <div className="mt-5 px-4">
            <h5 className="font-urbanist font-medium">Customer Information</h5>

            <ForgeForm onSubmit={createOrder} className="mt-3 mb-10">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Forger
                  name="customer_name"
                  placeholder="Customer Name"
                  // label="Business Name"
                  component={TextInput}
                  startAdornment={
                    <User className="h-5 w-5 mr-2 text-gray-400" />
                  }
                />
                <Forger
                  name="customer_phone"
                  placeholder="Customer Phone"
                  // label="Business Name"
                  component={TextInput}
                  startAdornment={
                    <Phone className="h-5 w-5 mr-2 text-gray-400" />
                  }
                />
              </div>

              <div className="mb-3">
                <Forger
                  name="customer_address"
                  placeholder="Customer Address"
                  // label="Business "
                  component={TextInput}
                  startAdornment={
                    <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                  }
                />
              </div>

              <div className="mb-3">
                <Forger
                  name="notes"
                  placeholder="Notes"
                  // label="Business Name"
                  component={TextArea}
                />
              </div>

              <h5 className="mt-5 font-urbanist font-medium">
                Custom Order List
              </h5>

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
                  type="button"
                  onClick={() => {
                    setOrders([]);
                  }}
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>

              <SheetFooter className="mt-20 items-end p-0">
                <SheetClose ref={closeRef} className="hidden" />
                <Button type={"submit"} isLoading={isPending} className="w-fit">
                  Create Order
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </SheetFooter>
            </ForgeForm>
          </div>
        </SheetDescription>
      </SheetContent>
    </Sheet>
  );
}

export default CreateCustomOrder;

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
        className="w-fit min-w-[2rem] border border-gray-300 rounded-md px-2 py-1"
        onBlur={onBlur}
      />
    );
  },
};
