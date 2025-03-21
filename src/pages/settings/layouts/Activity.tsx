import { DataTable } from "@/components/layouts/DataTable";
import { getRequest } from "@/lib/axiosInstance";
import { ApiListResponse, ApiResponseError } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

interface Props {}
export interface ActivityType {
  id: string;
  profile: string;
  activity: string;
  timestamp: Date;
}

function Activity(props: Props) {
  const {} = props;

  const { data, isLoading } = useQuery<
    ApiListResponse<ActivityType[]>,
    ApiResponseError
  >({
    queryKey: ["activity-log"],
    queryFn: async () => await getRequest("profile/activity-log/"),
  });

  const columns: ColumnDef<ActivityType>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "activity", header: "Activity" },
    { accessorKey: "profile", header: "Profile" },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: ({ row }) => {
        return format(row.getValue("timestamp"), "MMM dd, yyyy hh:mm a");
      },
    },
  ];

  return (
    <div>
      <DataTable
        data={(data?.data.results.data as any) ?? []}
        columns={columns as any}
        options={{
          disableSelection: true,
          isLoading,
        }}
      />
    </div>
  );
}

export default Activity;
