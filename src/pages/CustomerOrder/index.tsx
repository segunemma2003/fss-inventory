import Container from "@/components/layouts/Container";
import { DataTable } from "@/components/layouts/DataTable";
import TextSearch from "@/components/layouts/FormInputs/TextInput";
import { Button } from "@/components/ui/button";
// import { getCustomerOrders } from "@/demo";
import { getRequest } from "@/lib/axiosInstance";
import {
  ApiListResponse,
  ApiResponseError,
  CustomerResponseData,
} from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { SlidersHorizontal } from "lucide-react";
import CreateCustomOrder from "./components/CreateCustomOrder";
import { OrderDialog } from "./Details";
import { useState } from "react";
import { useFilter } from "@/hooks/useFilter";

export type CustomerOrderType = {
  name: string;
  amount_spent: string;
  purchase_method: string;
};

function CustomerOrder() {
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
    <Container className="py-10">
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
    </Container>
  );
}

export default CustomerOrder;
