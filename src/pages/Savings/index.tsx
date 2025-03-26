import Container from "@/components/layouts/Container";
import { DataTable } from "@/components/layouts/DataTable";
import TextSearch from "@/components/layouts/FormInputs/TextInput";
import { Button } from "@/components/ui/button";
import { getRequest } from "@/lib/axiosInstance";
import { ApiListResponse, ApiResponseError } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import CreateSavingsPlan from "./components/CreateSavings";
import { ConfirmAlert } from "@/components/layouts/ConfirmAlert";
import { Trash } from "lucide-react";
import EditSavingsPlan from "./components/EditSavving";

interface Plan {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
  duration_display: string;
  total_products: number;
  is_active: boolean;
  created_at: Date;
}

function Savings() {
  const [search, setSearch] = useState({
    query: "",
    fields: ["customer_name", "category_name"],
  });

  const { data, isLoading } = useQuery<
    ApiListResponse<Plan[]>,
    ApiResponseError
  >({
    queryKey: ["plans", search.query],
    queryFn: async () => await getRequest("plans/"),
    refetchOnWindowFocus: false,
  });

  const columns: ColumnDef<Plan>[] = [
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "duration_display",
      header: "Duration",
    },
    {
      accessorKey: "is_active",
      header: "Active",
    },
    {
      accessorKey: "total_products",
      header: "Total Product",
    },
    {
      accessorKey: "price",
      header: "Credit Limit",
    },
    {
      id: "action",
      header: "ACTION",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <ConfirmAlert
              text="Are you sure, you want to delete this savings plan?"
              url={`/plans/${row.original.id}/`}
              title={``}
              trigger={
                <Button size={"icon"} variant={"destructive"} className="">
                  <Trash />
                </Button>
              }
            />
            <EditSavingsPlan {...row.original} />
          </div>
        );
      },
    },
  ];

  return (
    <Container as="section" className="py-10">
      <div className="flex items-center justify-between mt-8 mb-3">
        <div className="flex items-center gap-3">
          <TextSearch
            value={search.query}
            onChange={(e) =>
              setSearch((prev) => ({ ...prev, query: e.target.value }))
            }
          />
          {/* <Button variant={"outline"} size={"icon"}>
              <SlidersHorizontal className="w-5 h-5 " />
            </Button> */}
        </div>
        <div className="flex items-center gap-3">
          <CreateSavingsPlan />
          {/* <Button
              disabled={!selectedRowId}
              onClick={() => deleteMutation.mutate()}
              className="rounded-full"
            >
              <Trash className="w-5 h-5 mr-3" />
              Delete
            </Button> */}
        </div>
      </div>

      <DataTable
        data={data?.data.results.data ?? []}
        columns={columns as ColumnDef<unknown>[]}
        config={{ enableMultiRowSelection: false }}
        options={{
          isLoading,
          disableSelection: true,
        }}
      />
    </Container>
  );
}

export default Savings;
