import Container from "@/components/layouts/Container";
import { DataTable } from "@/components/layouts/DataTable";
import { MapList } from "@/components/layouts/MapList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, getTimeGreetings } from "@/lib/utils";
import { useUser } from "@/store/authSlice";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { AxiosResponse } from "axios";
import { Box } from "lucide-react";
import { ProductAnalytics, ProductList } from "./ProductInventory";
import { ApiListResponse, ApiResponseError } from "@/types";
import { getRequest } from "@/lib/axiosInstance";
import { useNavigate } from "react-router";
// import { FaRegEdit } from "react-icons/fa";

type ProductData = {
  product_name: string;
  product_category: string;
  available: number;
};

export const DashboardPage = () => {

  const analyticsQuery = useQuery<
    AxiosResponse<ProductAnalytics>,
    ApiResponseError
  >({
    queryKey: ["analytics"],
    queryFn: async () => await getRequest("products/analytics/"),
  });

  const { data, isLoading } = useQuery<
  ApiListResponse<ProductList>,
    ApiResponseError
  >({
    queryKey: ["analytics"],
    queryFn: async () => await getRequest("products/", { params: { min_quantity: 20 } }),
  });

  const metrics = [
    {
      title: "Total Stock Quantity",
      value: analyticsQuery.data?.data.total_stock_quantity.toString() ?? '0',
      change: "15",
      isPositive: true,
    },
    {
      title: "Total Stock Value",
      value: formatCurrency(parseInt(analyticsQuery.data?.data.total_stock_value ?? "0"), "en-NG", "NGN"),
      change: "15",
      isPositive: true,
    },
    {
      title: "Profit Margin",
      value: formatCurrency(parseInt(analyticsQuery.data?.data.total_profit_generated ?? "0"), "en-NG", "NGN"),
      change: "4",
    },
    {
      title: "Total Product Sold",
      value: analyticsQuery.data?.data.total_products.toString() ?? '0',
      change: "17",
      isPositive: true,
    },
  ];

  const columns: ColumnDef<ProductData>[] = [
    { accessorKey: "product_name", header: "Product Name" },
    { accessorKey: "product_category", header: "Product Category" },
    { accessorKey: "available", header: "Available" },
  ];

  return (
    <Container className="py-10">
      <DashboardHeader />
      <div className="grid grid-cols-4 gap-7 mt-8">
        <MapList
          data={metrics}
          renderItem={(item) => <MetricCard key={item.title} {...item} />}
        />
      </div>
      {/* <DashboardBanner /> */}
      <div className="mt-8">
        <Card>
          <CardContent>
            <DataTable
              data={data?.data.results.data as any ?? []}
              columns={columns as any}
              options={{ isLoading }}
              header={() => (
                <div className="font-urbanist">
                  <h5 className="text-sm font-bold">Low - Stock Product</h5>
                  <p className="text-xs text-gray-400">
                    1,212 items are low in stock
                  </p>
                </div>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export const DashboardHeader = () => {
  const user = useUser();
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between">
      <h3 className="text-primary text-2xl font-urbanist font-bold">
        {getTimeGreetings()}, {user?.full_name} ( FoodStuffs Store ){" "}
      </h3>
      <div className="flex items-center gap-3 ">
        <Button onClick={() => navigate('/dashboard/add-product')} variant={"outline"} className="rounded-full">
          <Box className="w-5 h-5 mr-3" />
          Add New Product
        </Button>
        {/* <Button variant={"default"} className="rounded-full">
          <FaRegEdit className="w-5 h-5 mr-3" />
          View My Task
        </Button> */}
      </div>
    </div>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive?: boolean;
}

const MetricCard = ({ title, value }: MetricCardProps) => {
  return (
    <Card className="rounded-2xl">
      <CardContent className="px-3">
        <h4 className="text-muted-foreground text-sm font-urbanist mb-2">
          {title}
        </h4>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold text-accent-foreground font-urbanist">
            {value}
          </p>
          {/* <span
            className={`text-sm font-medium ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositive ? "+" : "-"}
            {change}%
          </span> */}
        </div>
      </CardContent>
    </Card>
  );
};

// const DashboardBanner = () => {
//   return (
//     <div className="rounded-lg bg-radial from-white from-0% to-40% to-primary flex items-center p-6 pb-3.5 mt-5 gap-6 backdrop-blur-md">
//       <div className="flex-1 flex gap-4 items-center">
//         <div className="h-44 w-[28rem] rounded-xl overflow-hidden">
//           <img
//             src="https://res.cloudinary.com/dymahyzab/image/upload/v1741356646/FSS_Inventory_Frame_1_f5pe5b.png"
//             className="h-full w-full object-cover overflow-hidden rounded-xl"
//           />
//         </div>
//         <div className="space-y-4">
//           <span className="block text-sm font-bold font-urbanist text-accent">
//             Fast selling Category
//           </span>
//           <h5 className="text-2xl text-primary font-semibold font-urbanist">
//             Canned Product
//           </h5>
//           <p className="text-base text-accent font-urbanist font-semibold">
//             This category has marked an average of 10% increase in the flow of
//             sales for the day.
//           </p>
//         </div>
//       </div>
//       <div className="self-end">
//         <Button variant={"secondary"} className="px-14 rounded-xl">
//           View Inventory
//         </Button>
//       </div>
//     </div>
//   );
// };
