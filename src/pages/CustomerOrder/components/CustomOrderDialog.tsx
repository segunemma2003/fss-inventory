import { DataTable } from "@/components/layouts/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
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

interface TotalSectionProps {
  total: string;
}

const TotalSection: React.FC<TotalSectionProps> = ({ total }) => {
  return (
    <div className="mt-6 w-full whitespace-nowrap text-neutral-900 max-md:max-w-full">
      <Separator className="w-full" />
      <div className="flex flex-wrap gap-10 justify-between items-end mt-5 w-full max-md:max-w-full">
        <h2 className="text-base leading-tight">Total</h2>
        <div className="flex gap-0.5 items-center px-2 text-2xl">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/877fbded3c1141a18415be7a6b510b08/b1f671dd598c424e325393851df1117eb48e817f4419e970d4499fc118408ea9?placeholderIfAbsent=true"
            alt="Currency icon"
            className="object-contain shrink-0 self-stretch my-auto w-5 aspect-[1.33]"
          />
          <span className="self-stretch my-auto">{total}</span>
        </div>
      </div>
    </div>
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
          <SquareArrowOutUpRight className="h-8 w-8" />
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

        <TotalSection total="12,427,00" />
      </DialogContent>
    </Dialog>
  );
};
