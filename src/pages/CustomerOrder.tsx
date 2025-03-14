import Container from "@/components/layouts/Container";
import { DataTable } from "@/components/layouts/DataTable";
import TextSearch from "@/components/layouts/FormInputs/TextInput";
import { Button } from "@/components/ui/button";
import { getCustomerOrders } from "@/demo";
import { ColumnDef } from "@tanstack/react-table";
import { SlidersHorizontal, Upload } from "lucide-react";

export type CustomerOrderType = {
  name: string;
  amount_spent: string;
  purchase_method: string;
};

function CustomerOrder() {
  const columns: ColumnDef<CustomerOrderType>[] = [
    { accessorKey: "name", header: "Customer Name" },
    {
      accessorKey: "purchase_method",
      header: "Purchase Method",
    },
    {
      accessorKey: "amount_spent",
      header: "Amount Spent",
    },
    {
      id: "action",
      header: "ACTION",
      cell: () => {
        return (
          <Button
            size={"sm"}
            variant={"outline"}
            className="rounded-full border-primary text-primary"
          >
            View Order
          </Button>
        );
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
          <Button className="rounded-full">
            <Upload className="w-5 h-5 mr-3" />
            Export
          </Button>
        </div>
      </div>
      <DataTable
        data={getCustomerOrders() ?? []}
        columns={columns}
        options={{
          disableSelection: true,
        }}
      />
    </Container>
  );
}

export default CustomerOrder;
