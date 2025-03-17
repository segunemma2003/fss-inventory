import Container from "@/components/layouts/Container";
import { DataTable } from "@/components/layouts/DataTable";
import TextSearch from "@/components/layouts/FormInputs/TextInput";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
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

interface TotalSectionProps {
  total: string;
}

const TotalSection: React.FC<TotalSectionProps> = ({ total }) => {
  return (
    <div className="mt-6 w-full whitespace-nowrap text-neutral-900 max-md:max-w-full">
      <Separator className="w-full" />
      <div className="flex flex-wrap gap-10 justify-between items-end mt-5 w-full max-md:max-w-full">
        <h2 className="text-3xl leading-tight">Total</h2>
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

const OrderDialog = () => {
  return (
    <Dialog>
      <DialogContent className="">
        <div className="flex overflow-hidden flex-col px-16 py-16 font-bold rounded-lg max-md:px-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Order List</h3>
          </div>
        </div>

        <div className="flex flex-wrap gap-5 justify-between mt-14 max-md:mt-10 max-md:max-w-full">
          <h2 className="my-auto text-3xl leading-tight text-red-600">
            Customer Purchase
          </h2>
        </div>

        <TotalSection total="12,427,00" />
      </DialogContent>
    </Dialog>
  );
};
