import Container from "@/components/layouts/Container";
import { DataTable } from "@/components/layouts/DataTable";
import TextSearch from "@/components/layouts/FormInputs/TextInput";
import { Button } from "@/components/ui/button";
import { getEmployees } from "@/demo";
import { ColumnDef } from "@tanstack/react-table";
import { SlidersHorizontal, User2 } from "lucide-react";

export type EmployeeType = {
  employee: string;
  userID: string;
  email: string;
  role: string;
};

export function Users() {
  const columns: ColumnDef<EmployeeType>[] = [
    { accessorKey: "employee", header: "Customer Name" },
    {
      accessorKey: "userID",
      header: "User ID",
    },
    {
      accessorKey: "email",
      header: "Email Address",
    },
    {
      id: "action",
      header: "Status",
      cell: () => {
        return (
          <Button
            size={"sm"}
            variant={"outline"}
            className="rounded-full"
          >
            On duty
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
            <User2 className="w-5 h-5 mr-3" />
            Create Profile
          </Button>
        </div>
      </div>
      <DataTable
        data={getEmployees() ?? []}
        columns={columns}
        options={{
          disableSelection: true,
        }}
      />
    </Container>
  );
}
