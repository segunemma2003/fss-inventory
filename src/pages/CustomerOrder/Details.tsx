import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/layouts/DataTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ApiResponse, ApiResponseError, CustomerResponseData } from "@/types";
import { getRequest } from "@/lib/axiosInstance";
import { formatCurrency } from "@/lib/utils";

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
    <section className="flex gap-2 items-center self-start mt-16 leading-none max-md:mt-10">
      <div className="self-stretch my-auto text-neutral-400 text-base w-[177px] space-y-2">
        <p>Customer Name:</p>
        <p className="">Order Date:</p>
        <p className="">Purchase Method:</p>
      </div>
      <div className="self-stretch my-auto text-base text-neutral-900 space-y-2">
        <p>{name}</p>
        <p className="">{gender}</p>
        <p className="">{purchaseMethod}</p>
      </div>
    </section>
  );
};

interface TotalSectionProps {
  total: string;
}

const TotalSection: React.FC<TotalSectionProps> = ({ total }) => {
  return (
    <div className="w-full whitespace-nowrap text-neutral-900 max-md:max-w-full">
      <Separator className="w-full" />
      <div className="flex flex-wrap gap-10 justify-between items-end mt-5 w-full max-md:max-w-full">
        <h2 className="text-base leading-tight">Total</h2>
        <div className="flex gap-0.5 items-center text-2xl">
          <span className="self-stretch my-auto">
            {formatCurrency(parseInt(total), "en-NG", "NGN")}
          </span>
        </div>
      </div>
    </div>
  );
};

export const OrderDialog = ({ id }: { id: string }) => {
  const { data, isLoading } = useQuery<
    ApiResponse<CustomerResponseData>,
    ApiResponseError
  >({
    queryKey: ["customerOrders-detail"],
    queryFn: async () => await getRequest(`orders/${id}/`),
  });

  console.log(data?.data);

  const columns: ColumnDef<CustomerResponseData["items"][0]>[] = [
    { accessorKey: "product_name", header: "Product Name" },
    {
      accessorKey: "product_category",
      header: "Category",
    },
    {
      accessorKey: "price",
      header: "Amount Spent",
      cell({ row }) {
        return formatCurrency(parseInt(row.original.price), "en-NG", "NGN");
      },
    },
  ];

  const customerOrder = data?.data.data;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"outline"} className="rounded-full">
          View Order
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <div className="mb-3">
          <h3 className="text-3xl font-semibold text-red-600">Order List</h3>
        </div>

        <CustomerInfo
          gender={customerOrder?.order_date ?? ""}
          name={customerOrder?.customer_name ?? ""}
          purchaseMethod={customerOrder?.payment_method ?? ""}
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

        <div className="flex items-center justify-between border-b pb-2 border-gray-200">
          <h2 className="text-sm">Tax</h2>
          <span className="self-stretch my-auto">
            {formatCurrency(parseInt(data?.data?.data?.tax ?? '0'), "en-NG", "NGN")}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-sm">Subtotal</h2>
          <span className="self-stretch my-auto">
            {formatCurrency(parseInt(data?.data?.data?.subtotal ?? '0'), "en-NG", "NGN")}
          </span>
        </div>
        <TotalSection total={data?.data?.data?.total ?? "0"} />
      </DialogContent>
    </Dialog>
  );
};
