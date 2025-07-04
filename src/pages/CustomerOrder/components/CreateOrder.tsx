import { DataTable } from "@/components/layouts/DataTable";
import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { TextSelect } from "@/components/layouts/FormInputs/TextSelect";
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
import { getRequest, postRequest } from "@/lib/axiosInstance";
import { Forger, useForge } from "@/lib/forge";
import { ApiList, ApiResponse, ApiResponseError, ProductData } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, RowData } from "@tanstack/react-table";
import {
  ArrowRight,
  Building,
  MapPin,
  Package,
  Phone,
  Plus,
  RotateCcw,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";

interface Props {}
type FormValue = {
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  payment_method: string;
  payment_source: string;
  business: string | null;
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
    products?: ProductData[];
  }
}

function CreateOrder(props: Props) {
  const {} = props;
  const handler = useToastHandlers();
  const queryClient = useQueryClient();
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const { ForgeForm } = useForge<FormValue>({
    defaultValues: {
      customer_name: "",
      customer_address: "",
      customer_phone: "",
      payment_method: "",
      payment_source: "",
      business: null,
      status: "pending",
      notes: ""
    }
  });
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Fetch products from API
  const { data: productsData } = useQuery<
    AxiosResponse<ApiList<{ data: ProductData[]}>>,
    ApiResponseError
  >({
    queryKey: ["products"],
    queryFn: async () => {
      return await getRequest("/products/");
    },
  });

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
        // Invalidate and refetch the orders query
        queryClient.invalidateQueries({ queryKey: ["customerOrders"] });
        // Reset the form and close the sheet
        setOrders([]);
        // Close the sheet
        closeRef.current?.click();
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
      <SheetContent className="!max-w-xl dark:bg-gray-900 dark:text-gray-100">
        <SheetHeader>
          <SheetTitle className="dark:text-gray-100">Create New Order</SheetTitle>
          <SheetDescription>
            <div className="mt-5">
              <h5 className="font-urbanist font-medium text-gray-900 dark:text-gray-100">
                Customer Information
              </h5>

              <ForgeForm onSubmit={createOrder} className="mt-3 mb-10">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Forger
                    name="customer_name"
                    placeholder="Customer Name"
                    label="Customer Name"
                    component={TextInput}
                    required
                    rules={{ 
                      required: "Customer name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters"
                      }
                    }}
                    startAdornment={
                      <User className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
                    }
                  />
                  <Forger
                    name="customer_address"
                    placeholder="Customer Address"
                    label="Customer Address"
                    component={TextInput}
                    required
                    rules={{ 
                      required: "Customer address is required" 
                    }}
                    startAdornment={
                      <MapPin className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Forger
                    name="customer_phone"
                    placeholder="Customer Phone"
                    label="Customer Phone"
                    component={TextInput}
                    type="tel"
                    required
                    rules={{ 
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9+\-\s()]*$/,
                        message: "Please enter a valid phone number"
                      }
                    }}
                    startAdornment={
                      <Phone className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
                    }
                  />
                  <Forger
                    name="payment_method"
                    placeholder="Select Payment Method"
                    label="Payment Method"
                    component={TextSelect}
                    required
                    rules={{ 
                      required: "Payment method is required" 
                    }}
                    options={[
                      { label: "Cash", value: "cash" },
                      { label: "Card", value: "card" },
                      { label: "Bank Transfer", value: "bank_transfer" },
                      { label: "Mobile Money", value: "mobile_money" },
                      { label: "Business Wallet", value: "business_wallet" }
                    ]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <Forger
                    name="payment_source"
                    placeholder="Select Payment Source"
                    label="Payment Source"
                    component={TextSelect}
                    required
                    rules={{ 
                      required: "Payment source is required" 
                    }}
                    options={[
                      { label: "Direct Payment", value: "direct" },
                      { label: "Business Wallet", value: "business_wallet" }
                    ]}
                  />
                  <Forger
                    name="business"
                    placeholder="Business"
                    label="Business"
                    component={TextInput}
                    startAdornment={
                      <Building className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
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

                <h5 className="mt-5 font-urbanist font-medium text-gray-900 dark:text-gray-100">Order List</h5>

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
                      products: productsData?.data?.results?.data || []
                    },
                  }}
                  columns={columns as ColumnDef<unknown>[]}
                  options={{
                    disableSelection: true,
                    disablePagination: true,
                  }}
                />
                <div className="flex items-center justify-between gap-3 mt-4">
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
                    type="button"
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
                  <Button 
                    type={"submit"} 
                    className="w-fit"
                    disabled={orders.length === 0}
                  >
                    Create Order
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </SheetFooter>
              </ForgeForm>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
      <SheetClose ref={closeRef} className="hidden" />
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

    // Use appropriate input type based on column ID
    const inputType = id === 'quantity' || id === 'price' ? 'number' : 'text';
    const inputStep = id === 'price' ? '0.01' : '1';
    const inputMin = '0';

    // If this is the product column, render a select input with product options
    if (id === 'product') {
      const products = table.options.meta?.products || [];
      
      return (
        <select
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          className="w-fit min-w-[10rem] p-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          onBlur={onBlur}
          required
        >
          <option value="">Select a product</option>
          {products.map((product: ProductData) => (
            <option key={product.id} value={product.id}>
              {product.name} - {product.uom}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        value={value as string}
        onChange={(e) => setValue(e.target.value)}
        className="w-fit min-w-[5rem] p-1 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        onBlur={onBlur}
        type={inputType}
        step={inputStep}
        min={inputMin}
        required
      />
    );
  },
};
