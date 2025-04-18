import Container from "@/components/layouts/Container";
import { DataTable } from "@/components/layouts/DataTable";
import TextSearch from "@/components/layouts/FormInputs/TextInput";
// import { getCustomerOrders } from "@/demo";
import { getRequest, getAxiosInstance } from "@/lib/axiosInstance";
import {
  ApiListResponse,
  ApiResponseError,
  CustomerResponseData,
  CustomOrderItem,
  CustomerOverview
} from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import CreateCustomOrder from "./components/CreateCustomOrder";
import CreateOrder from "./components/CreateOrder";
import { OrderDialog } from "./Details";
import { useState } from "react";
import { useFilter } from "@/hooks/useFilter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ShoppingBasket, ShoppingCart, Trash, Users } from "lucide-react";
import { CustomOrderDialog } from "./components/CustomOrderDialog";
import { ConfirmAlert } from "@/components/layouts/ConfirmAlert";
import UpdateCustomOrder from "./components/UpdateCustomOrder";
import { CustomerProductsDialog } from "./components/CustomerProductsDialog";
import { formatCurrency } from "@/lib/utils";
import axios from "axios";

export type CustomerOrderType = {
  name: string;
  amount_spent: string;
  purchase_method: string;
};

function CustomerOrder() {
  return (
    <Container className="py-10">
      <Tabs defaultValue="tab-1">
        <ScrollArea>
          <TabsList className="mb-3">
            <TabsTrigger value="tab-1">
              <ShoppingCart
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Orders
            </TabsTrigger>
            <TabsTrigger value="tab-2" className="group">
              <ShoppingBasket
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Custom Orders
            </TabsTrigger>
            <TabsTrigger value="tab-3" className="group">
              <Users
                className="-ms-0.5 me-1.5 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Customers
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="tab-1">
          <Orders />
        </TabsContent>
        <TabsContent value="tab-2">
          <CustomOrder />
        </TabsContent>
        <TabsContent value="tab-3">
          <Customers />
        </TabsContent>
      </Tabs>
    </Container>
  );
}

export default CustomerOrder;

const Orders = () => {
  const [query, setQuery] = useState({
    query: "",
    fields: ["customer_name", "category_name"],
  });

  const { data, isLoading } = useQuery<
    ApiListResponse<CustomerResponseData[]>,
    ApiResponseError
  >({
    queryKey: ["customerOrders"],
    queryFn: async () => await getRequest("orders/"),
  });

  const { data: OrderList } = useFilter({
    data: data?.data.results.data as any,
    search: query,
  });

  const columns: ColumnDef<CustomerResponseData>[] = [
    { accessorKey: "customer_name", header: "Customer Name" },
    {
      accessorKey: "payment_method_display",
      header: "Purchase Method",
    },
    {
      accessorKey: "total",
      header: "Amount Spent",
    },
    {
      id: "action",
      header: "ACTION",
      cell: ({ row }) => {
        return <OrderDialog id={row.original.id} />;
      },
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between mt-8 mb-3">
        <div className="flex items-center gap-3">
          <TextSearch
            value={query.query}
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, query: e.target.value }))
            }
          />
        </div>
        <div className="flex items-center gap-3">
          <CreateOrder />
        </div>
      </div>
      <DataTable
        data={OrderList ?? []}
        columns={columns as ColumnDef<unknown>[]}
        options={{
          disableSelection: true,
          isLoading,
        }}
      />
    </>
  );
};

const CustomOrder = () => {
  const [query, setQuery] = useState({
    query: "",
    fields: ["customer_name", "category_name"],
  });

  const { data, isLoading } = useQuery<
    ApiListResponse<CustomOrderItem[]>,
    ApiResponseError
  >({
    queryKey: ["customOrders"],
    queryFn: async () => await getRequest("orders/custom/"),
  });

  const { data: OrderList } = useFilter({
    data: data?.data.results.data as any,
    search: query,
  });

  const columns: ColumnDef<CustomOrderItem>[] = [
    { accessorKey: "customer_name", header: "Customer Name" },
    {
      accessorKey: "customer_address",
      header: "Customer Name",
    },
    {
      accessorKey: "customer_phone",
      header: "Customer Phone",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "action",
      header: "ACTION",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <ConfirmAlert
              text={`You are about to delete this order by ${row.original.customer_name}, are you sure?`}
              title="Delete Custom Order"
              trigger={<Trash className="h-4 w-4 cursor-pointer text-red-800" />}
            />
            <UpdateCustomOrder id={row.original.id} />
            <CustomOrderDialog id={row.original.id} />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between mt-8 mb-3">
        <div className="flex items-center gap-3">
          <TextSearch
            value={query.query}
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, query: e.target.value }))
            }
          />
        </div>
        <div className="flex items-center gap-3">
          <CreateCustomOrder />
        </div>
      </div>
      <DataTable
        data={OrderList ?? []}
        columns={columns as ColumnDef<unknown>[]}
        options={{
          disableSelection: true,
          isLoading,
        }}
      />
    </>
  );
};

const Customers = () => {
  const [query, setQuery] = useState({
    query: "",
    fields: ["first_name", "last_name", "email"],
  });

  const { data, isLoading } = useQuery<
    ApiListResponse<CustomerOverview[]>,
    ApiResponseError
  >({
    queryKey: ["customers"],
    queryFn: async () => {
      const baseUrl = "https://iu36btxbs4d5awdsyrz2ahab4y0zvodv.lambda-url.us-east-2.on.aws/api/v1/";
      const response = await axios.get(`${baseUrl}auth/admin/customers/overview/`, {
        headers: { "Security-Key": "dj8K9m#P$2nL5v@xQ7wR3tY1aZ4hC6fE" },
      });
      return response;
    },
  });

  const { data: customerList } = useFilter({
    data: data?.data.results.data as any,
    search: query,
  });

  const columns: ColumnDef<CustomerOverview>[] = [
    { 
      accessorFn: (row) => `${row.first_name} ${row.last_name}`,
      header: "Customer Name" 
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone_number",
      header: "Phone Number",
    },
    {
      accessorKey: "total_purchases",
      header: "Purchases",
    },
    {
      accessorFn: (row) => formatCurrency(row.total_amount_spent, "en-NG", "NGN"),
      header: "Total Spent",
    },
    {
      accessorKey: "purchase_frequency",
      header: "Frequency",
    },
    {
      id: "action",
      header: "ACTION",
      cell: ({ row }) => {
        return <CustomerProductsDialog customer={row.original} />;
      },
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between mt-8 mb-3">
        <div className="flex items-center gap-3">
          <TextSearch
            value={query.query}
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, query: e.target.value }))
            }
          />
        </div>
      </div>
      <DataTable
        data={customerList ?? []}
        columns={columns as ColumnDef<unknown>[]}
        options={{
          disableSelection: true,
          isLoading,
        }}
      />
    </>
  );
};
