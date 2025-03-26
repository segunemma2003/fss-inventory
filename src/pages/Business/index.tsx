import { ConfirmAlert } from "@/components/layouts/ConfirmAlert";
import Container from "@/components/layouts/Container";
import { DataTable, DataTableRef } from "@/components/layouts/DataTable";
import { IndeterminateCheckbox } from "@/components/layouts/DataTable/components";
import TextSearch from "@/components/layouts/FormInputs/TextInput";
import { Button } from "@/components/ui/button";
import { useToastHandlers } from "@/hooks/useToaster";
import { deleteRequest, getRequest } from "@/lib/axiosInstance";
import { ApiListResponse, ApiResponseError } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, SlidersHorizontal, Trash, User } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router";

interface Props {}
interface BusinessListType {
  name: string;
  id: string;
  registered_email: string;
  cac_number: string;
  credit_limit: number;
}

export interface BusinessResponseData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  business_type: string;
  industry: string;
  cac_number: string;
  website: string;
  is_active: boolean;
  created_at: string;
}

const getBusinesses = (data: BusinessResponseData[]): BusinessListType[] => {
  return data.map((item) => ({
    credit_limit: 0,
    id: item.id,
    name: item.name,
    registered_email: item.email,
    cac_number: item.cac_number,
  }));
};

function Business(props: Props) {
  const navigate = useNavigate();
  const Thandler = useToastHandlers();
  const {} = props;
  const [search, setSearch] = useState({
    query: "",
    fields: ["customer_name", "category_name"],
  });

  // Create a ref for the DataTable
  const tableRef = useRef<DataTableRef<BusinessListType>>(null);

  const { data, isLoading } = useQuery<
    ApiListResponse<BusinessResponseData[]>,
    ApiResponseError
  >({
    queryKey: ["businesses", search.query],
    queryFn: async () => await getRequest("business/"),
    refetchOnWindowFocus: false,
  });

  const selectedRowId =
    tableRef.current?.table.getSelectedRowModel().rows[0]?.original.id;

  const deleteMutation = useMutation({
    mutationFn: async () => await deleteRequest(`/business/${selectedRowId}/`),
    onSuccess(data) {
      if (typeof data.data.message === "string") {
        Thandler.success("Business Profile", data.data.message);
      }
    },
    // onError(error, variablecontext) {},
  });

  const columns: ColumnDef<BusinessListType>[] = [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <IndeterminateCheckbox
    //       {...{
    //         checked: table.getIsAllRowsSelected(),
    //         indeterminate: table.getIsSomeRowsSelected(),
    //         onChange: table.getToggleAllRowsSelectedHandler(),
    //       }}
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <div className="px-1">
    //       <IndeterminateCheckbox
    //         {...{
    //           checked: row.getIsSelected(),
    //           disabled: !row.getCanSelect(),
    //           indeterminate: row.getIsSomeSelected(),
    //           onChange: row.getToggleSelectedHandler(),
    //         }}
    //       />
    //     </div>
    //   ),
    // },
    { accessorKey: "name", header: "Business Name" },
    {
      accessorKey: "id",
      header: "Business ID",
    },
    {
      accessorKey: "registered_email",
      header: "Registered Email",
    },
    {
      accessorKey: "cac_number",
      header: "CAC Number",
    },
    {
      accessorKey: "credit_limit",
      header: "Credit Limit",
    },
    {
      id: "action",
      header: "ACTION",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-3">
            <ConfirmAlert
              text="Are you sure, you want to delete this business?"
              url={`/business/${row.original.id}/`}
              title={``}
              trigger={
                <Button
                  size={"icon"}
                  variant={"destructive"}
                  className=""
                >
                  <Trash />
                </Button>
              }
            />
            <Button
              size={"icon"}
              variant={"ghost"}
              className=""
              onClick={() =>
                navigate("/dashboard/business-id/details", {
                  state: { id: row.original?.id },
                })
              }
            >
              <ChevronRight />
            </Button>
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
          <Button
            onClick={() => navigate("/dashboard/business-id/create")}
            className="rounded-full"
          >
            <User className="w-5 h-5 mr-3" />
            Create Profile
          </Button>
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
        data={getBusinesses(data?.data?.results?.data ?? []) ?? []}
        columns={columns as ColumnDef<unknown>[]}
        config={{ enableMultiRowSelection: false }}
        options={{
          isLoading,
          disableSelection: true
        }}
      />
    </Container>
  );
}

export default Business;
