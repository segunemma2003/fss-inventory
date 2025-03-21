import Container from "@/components/layouts/Container";
import { DataTable } from "@/components/layouts/DataTable";
import TextSearch from "@/components/layouts/FormInputs/TextInput";
import { Button } from "@/components/ui/button";
import { getRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { SlidersHorizontal } from "lucide-react";
import { AddNewMember } from "./components/AddMember";

export type EmployeeType = {
  employee: string;
  userID: string;
  email: string;
  role: string;
};

export interface ProfileList {
  id: string;
  full_name: string;
  address: null;
  email: string;
  phone_number: null;
  display_name: string;
  is_locked: boolean;
  created_at: Date;
  updated_at: Date;
}

export function Users() {

  const { data, isLoading } = useQuery<
    ApiResponse<ProfileList[]>,
    ApiResponseError
  >({
    queryKey: ["users"],
    queryFn: async () => await getRequest("profile/"),
  });

  const columns: ColumnDef<ProfileList>[] = [
    { accessorKey: "full_name", header: "Customer Name" },
    {
      accessorKey: "id",
      header: "User ID",
    },
    {
      accessorKey: "email",
      header: "Email Address",
    },
    {
      accessorKey: "phone_number",
      header: "Phone Number",
    },
    {
      accessorKey: "is_locked",
      header: "Locked",
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
         <AddNewMember />
        </div>
      </div>

      <DataTable
        data={data?.data.data ?? []}
        columns={columns as any}
        options={{
          disableSelection: true,
          isLoading
        }}
      />
    </Container>
  );
}
