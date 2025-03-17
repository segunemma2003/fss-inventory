import Container from "@/components/layouts/Container";
import { DataTable } from "@/components/layouts/DataTable";
import TextSearch from "@/components/layouts/FormInputs/TextInput";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
// import { getCustomerOrders } from "@/demo";
import { getRequest } from "@/lib/axiosInstance";
import {
  ApiListResponse,
  ApiResponseError,
  CustomerResponseData,
} from "@/types";
import { DialogContent } from "@radix-ui/react-dialog";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { SlidersHorizontal, Upload } from "lucide-react";

export type CustomerOrderType = {
  name: string;
  amount_spent: string;
  purchase_method: string;
};

const getCustomerOrders = (data: CustomerResponseData[]) => {
  if (data) {
    return data?.map((item) => ({
      name: item?.customer_name,
      amount_spent: item?.total,
      purchase_method: item?.payment_method,
    }));
  }
};

function CustomerOrder() {
  const { data, isLoading } = useQuery<
    ApiListResponse<CustomerResponseData[]>,
    ApiResponseError
  >({
    queryKey: ["customerOrders"],
    queryFn: async () => await getRequest("orders/"),
  });

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
        data={getCustomerOrders(data?.data?.results?.data ?? []) ?? []}
        columns={columns}
        options={{
          disableSelection: true,
          isLoading,
        }}
      />
    </Container>
  );
}

export default CustomerOrder;

interface CustomerInfoProps {
  name: string;
  gender: string;
  purchaseMethod: string;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({
  name,
  gender,
  purchaseMethod,
}) => {
  return (
    <section className="flex gap-2 items-center self-start mt-16 text-2xl leading-none max-md:mt-10">
      <div className="self-stretch my-auto text-neutral-400 w-[177px]">
        <p>Customer Name:</p>
        <p className="mt-5">Gender:</p>
        <p className="mt-5">Purchase Method:</p>
      </div>
      <div className="self-stretch my-auto text-neutral-900 w-[179px]">
        <p>{name}</p>
        <p className="mt-5">{gender}</p>
        <p className="mt-5">{purchaseMethod}</p>
      </div>
    </section>
  );
};

const OrderDialog = () => {
  return (
    <Dialog>
      <DialogContent className="">
        <div className="flex overflow-hidden flex-col px-16 py-16 font-bold rounded-lg max-md:px-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Order List</h3>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
