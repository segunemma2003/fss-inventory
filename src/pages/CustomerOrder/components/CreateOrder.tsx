import { DataTable } from "@/components/layouts/DataTable";
import { TextInput } from "@/components/layouts/FormInputs/TextInput";
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
import { postRequest } from "@/lib/axiosInstance";
import { Forger, useForge } from "@/lib/forge";
import { ApiResponse, ApiResponseError } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef, RowData } from "@tanstack/react-table";
import {
  ArrowRight,
  Building,
  IdCard,
  MapPin,
  Package,
  Phone,
  Plus,
  RotateCcw,
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

function CreateOrder(props: Props) {
  const {} = props;
  const handler = useToastHandlers();
  const { ForgeForm } = useForge<FormValue>({});
  const [orders, setOrders] = useState<Order[]>([]);

  const { mutate: createOrder } = useMutation<
    ApiResponse,
    ApiResponseError,
    FormValue
  >({
    mutationFn: async (values) => {
      return await postRequest("/orders/", { ...values, items: orders });
    },
    onSuccess(data) {
      if (typeof data.data.message === "string") {
        handler.success("Order Creation", data.data.message);
      }
    },
    onError(error) {
      handler.error("Order Creation", error);
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
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="rounded-full">
          <Package className="h-5 w-5 mr-2" />
          Create Order
        </Button>
      </SheetTrigger>
      <SheetContent className="!max-w-xl">
        <SheetHeader>
          <SheetTitle>Create New Order</SheetTitle>
          <SheetDescription>
            <div className="mt-5">
              <h5 className="font-urbanist font-medium">
                Customer Information
              </h5>

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
                    name="customer_address"
                    placeholder="Customer Address"
                    // label="Business "
                    component={TextInput}
                    startAdornment={
                      <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Forger
                    name="customer_phone"
                    placeholder="Customer Phone"
                    // label="Business Name"
                    component={TextInput}
                    startAdornment={
                      <Phone className="h-5 w-5 mr-2 text-gray-400" />
                    }
                  />
                  <Forger
                    name="payment_method"
                    placeholder="Payment Method"
                    // label="Business Type"
                    component={TextInput}
                    startAdornment={
                      <IdCard className="h-5 w-5 mr-2 text-gray-400" />
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Forger
                    name="payment_source"
                    placeholder="Payment Source"
                    // label="Business Name"
                    component={TextInput}
                    startAdornment={
                      <User className="h-5 w-5 mr-2 text-gray-400" />
                    }
                  />
                  <Forger
                    name="business"
                    placeholder="Business"
                    // label="Business Type"
                    component={TextInput}
                    startAdornment={
                      <Building className="h-5 w-5 mr-2 text-gray-400" />
                    }
                  />
                </div>

                {/* <div className="grid grid-cols-2 gap-3 mb-3">
                  <Forger
                    name="customer_name"
                    placeholder="Hom"
                    label="Business Name"
                    component={TextInput}
                    startAdornment={
                      <User className="h-5 w-5 mr-2 text-gray-400" />
                    }
                  />
                  <Forger
                    name="customer_address"
                    placeholder="retail"
                    label="Business Type"
                    component={TextInput}
                    startAdornment={
                      <Building className="h-5 w-5 mr-2 text-gray-400" />
                    }
                  />
                </div> */}

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
                    Create Order
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

export default CreateOrder;

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
