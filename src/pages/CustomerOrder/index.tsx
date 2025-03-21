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
import { SlidersHorizontal, Upload } from "lucide-react";
import CreateCustomOrder from "./components/CreateCustomOrder";
import { OrderDialog } from "./Details";

export type CustomerOrderType = {
  name: string;
  amount_spent: string;
  purchase_method: string;
};


function CustomerOrder() {
  const { data, isLoading } = useQuery<
    ApiListResponse<CustomerResponseData[]>,
    ApiResponseError
  >({
    queryKey: ["customerOrders"],
    queryFn: async () => await getRequest("orders/"),
  });

  const columns: ColumnDef<CustomerResponseData>[] = [
    { accessorKey: "name", header: "Customer Name" },
    {
      accessorKey: "purchase_method",
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
        return (
          <OrderDialog id={row.original.id} />
        )
      },
    },
  ];

  return (
    <Container className="py-10">
      <div className="flex items-center justify-between mt-8 mb-3">
        <div className="flex items-center gap-3">
          <TextSearch />
          <Button variant={"outline"} size={"icon"}>
            <SlidersHorizontal className="w-5 h-5 " />
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <CreateCustomOrder />
          <Button className="rounded-full">
            <Upload className="w-5 h-5 mr-3" />
            Export
          </Button>
        </div>
      </div>
      <DataTable
        data={data?.data?.results?.data  ?? []}
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
