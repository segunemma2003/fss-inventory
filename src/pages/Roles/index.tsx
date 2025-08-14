/* eslint-disable @typescript-eslint/no-explicit-any */
// import Container from "@/components/layout/Container";
// import { Typography } from "@/components/ui/Typography";
import { DataTable } from "@/components/layouts/DataTable";
import { RolePermission } from "./RolePermission";
// import { CardPlaceholder } from "@/Layouts/CardPlaceholder";
// import BreadCrumps from "@/components/ui/BreadCrumps";
// import { useUserAuthority } from "@/hooks/useUserAuthority";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { AxiosResponse } from "axios";
import { ApiResponse, ApiResponseError } from "@/types";
import {
  getRequest,
  patchRequest,
  postRequest,
} from "@/lib/axiosInstance";
import { ColumnDef } from "@tanstack/react-table";
import { useToastHandlers } from "@/hooks/useToaster";
import { combineActions, reverseCombine } from "@/lib/utils";
// import { UnAuthorized } from "../UnAuthorized";
import { Button } from "@/components/ui/button";
import { TfiReload } from "react-icons/tfi";
import { ConfirmAlert } from "@/components/layouts/ConfirmAlert";
import { RiDeleteBinLine } from "react-icons/ri";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import Container from "@/components/layouts/Container";

type Role = {
  id: string;
  name: string;
  created_at: string;
  total_permissions: number;
  priviledges: string[];
};

type FormValue = {
  name: string;
  priviledges: string[];
  roleId: string;
};

const Role = () => {
  const toastHandler = useToastHandlers();
  // const [selectedRole, setSelectedRole] = useState<string | null>(null);
  //   const { canCreate, canDelete, canUpdate, canView } =
  //     useUserAuthority("roles");

  // Access the client
  const queryClient = useQueryClient();

  const updateMutation = useMutation<
    ApiResponse<{ role: Role }>,
    ApiResponseError,
    FormValue
  >({
    mutationFn: (payload: {
      name: string;
      priviledges: string[];
      roleId: string;
    }) => {
      return patchRequest(`auth/roles/${payload.roleId}/`, payload);
    },
  });

  const handleUpdate = async (data: Record<string, any>) => {
    const TOAST_TITTLE = "Roles";

    try {
      const payload = combineActions(data);

      const result = await updateMutation.mutateAsync({
        name: data.name,
        priviledges: payload,
        roleId: data.id,
      });

      if (typeof result.data.message === 'string') {
        toastHandler.success(TOAST_TITTLE, result.data.message);
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["roles"] });
    } catch (error) {
      toastHandler.error(TOAST_TITTLE, error as ApiResponseError);
    }
  };

  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "total_permissions",
      header: "Total Permission",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("total_permissions")}</div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      id: "actions",
      //   enableHiding: !canUpdate && !canDelete,
      cell: ({ row }) => (
        <div className="flex gap-1">
          {true && (
            <RolePermission
              title="Update"
              loading={updateMutation.isPending}
              defaultValues={{
                name: row.original.name,
                ...reverseCombine(row.original.priviledges),
              }}
              onSubmit={(data) => handleUpdate({ ...data, ...row.original })}
            />
          )}
          {/* {true && (
            <DeleteRole roleId={row.original.id} onDelete={handleDelete} />
          )} */}
          <ConfirmAlert
            trigger={
              <Button
                variant="outline"
                size="icon"
                className="border-red-600 hover:bg-red-200 hover:border-red-200"
              >
                <RiDeleteBinLine className="text-red-600" />
              </Button>
            }
            text="Are you sure you want to deleted this item, this operation can
                not be undone."
            title="Are you sure?"
            // icon={<AiOutlineExclamationCircle size={20} />}
            queryKey={["roles"]}
            url={`auth/roles/${row.original.id}/`}
          />
        </div>
      ), // Use the component here
    },
  ];

  const {
    data,
    refetch,
    isFetching: isFetchingRoles,
  } = useQuery<ApiResponse<{ roles: Role[] }>, ApiResponseError>({
    queryKey: ["roles"],
    queryFn: async () => await getRequest("auth/roles/"),
  });

  const { mutateAsync, ...createMutates } = useMutation<
    ApiResponse,
    ApiResponseError,
    { name: string; priviledges: string[] }
  >({
    mutationFn: (payload) => {
      return postRequest("auth/roles/", payload);
    },
  });

  const onSubmit = async (data: Record<string, any>) => {
    const TOAST_TITTLE = "Roles ";
    try {
      const payload = combineActions(data);

      if (typeof data.name === "boolean" && Array.isArray(data.name)) return;

      const result = await mutateAsync({
        name: data.name,
        priviledges: payload,
      });

      if (typeof result.data.message === 'string') {
        toastHandler.success(TOAST_TITTLE, result.data.message);
      }

      queryClient.invalidateQueries({ queryKey: ["roles"] });
    } catch (error) {
      toastHandler.error(TOAST_TITTLE, error as ApiResponseError);
    }
  };

  //   if (!canView) {
  //     return <UnAuthorized />;
  //   }

  return (
    <Container className="py-10">
      <div className="flex items-center justify-end gap-3 mb-3">
        <RolePermission
          loading={createMutates.isPending}
          onSubmit={onSubmit}
          defaultValues={{}}
          //   showBtn={canCreate}
          showBtn
        />

        <Button
          className=""
          // variant="ghost"
          size={"icon"}
          onClick={() => {
            refetch();
          }}
        >
          <TfiReload />
        </Button>
      </div>

      <div className="">
        <DataTable
          columns={columns as ColumnDef<unknown>[]}
          data={data?.data?.data?.roles ?? []}
          options={{
            disableSelection: true,
            isLoading: isFetchingRoles,
          }}
        />
      </div>
    </Container>
  );
};

export default Role;
