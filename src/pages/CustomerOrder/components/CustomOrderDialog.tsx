import { DataTable } from "@/components/layouts/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError, CustomerResponseData, CustomOrderDetail } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { SquareArrowOutUpRight } from "lucide-react";

interface CustomerInfoProps {
  name: string;
  date: string;
  phone: string;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({
  name,
  date,
  phone,
}) => {
  return (
    <section className="flex gap-2 items-center self-start mt-16 leading-none max-md:mt-10">
      <div className="self-stretch my-auto text-neutral-400 text-base w-[177px] space-y-2">
        <p>Customer Name:</p>
        <p className="">Customer Phone:</p>
        <p className="">Customer Address:</p>
      </div>
      <div className="self-stretch my-auto text-base text-neutral-900 space-y-2">
        <p>{name}</p>
        <p className="">{phone}</p>
        <p className="">{date}</p>
      </div>
    </section>
  );
};


export const CustomOrderDialog = ({ id }: { id: string }) => {
  const { data, isLoading } = useQuery<
    ApiResponse<CustomOrderDetail>,
    ApiResponseError
  >({
    queryKey: ["custom-order-detail"],
    queryFn: async () => await getRequest(`orders/custom/${id}/`),
  });

  const columns: ColumnDef<CustomerResponseData["items"][0]>[] = [
    { accessorKey: "name", header: "Product Name" },
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
      header: "Amount Spent",
    },
  ];

  const customerOrder = data?.data.data;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"icon"} variant={"ghost"}>
          <SquareArrowOutUpRight className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <div className="mb-3">
          <h3 className="text-3xl font-semibold text-red-600">Order List</h3>
        </div>

        <CustomerInfo
          date={customerOrder?.customer_address ?? ""}
          name={customerOrder?.customer_name ?? ""}
          phone={customerOrder?.customer_phone ?? ""}
        />

        <DataTable
          data={customerOrder?.items ?? []}
          columns={columns as ColumnDef<unknown>[]}
          options={{
            disableSelection: true,
            disablePagination: true,
            isLoading,
          }}
        />

        {/* <TotalSection total={data?.data.data} /> */}
      </DialogContent>
    </Dialog>
  );
};
