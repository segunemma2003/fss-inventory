import Container from "@/components/layouts/Container";
import { DataTable } from "@/components/layouts/DataTable";
import TextSearch from "@/components/layouts/FormInputs/TextInput";
import { MapList } from "@/components/layouts/MapList";
import { MetricCard } from "@/components/layouts/MetricCard";
import { Button } from "@/components/ui/button";
import { useFilter } from "@/hooks/useFilter";
import { getRequest } from "@/lib/axiosInstance";
import { formatCurrency } from "@/lib/utils";
import { ApiListResponse, ApiResponseError, ProductData } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { AxiosResponse } from "axios";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { CategoryDialog } from "@/components/layouts/CategoryDialog";
import { UpdateProductDialog } from "@/components/layouts/UpdateProductDialog";

export interface ProductAnalytics {
  total_products: number;
  total_stock_quantity: number;
  total_stock_value: string;
  total_profit_generated: string;
  low_stock_products: number;
  expired_products: number;
  expiring_soon_products: number;
}

export interface ProductList {
  id: string;
  name: string;
  category_name: string;
  selling_price: string;
  quantity: number;
  uom: string;
  image: string;
  expiry_date: Date;
  order_history: OrderHistory;
}

export interface OrderHistory {}

export const ProductInventory = () => {
  const [query, setQuery] = useState({
    query: "",
    fields: ["name", "category_name"],
  });
  const navigate = useNavigate();

  const analyticsQuery = useQuery<
    AxiosResponse<ProductAnalytics>,
    ApiResponseError
  >({
    queryKey: ["analytics"],
    queryFn: async () => await getRequest("products/analytics/"),
  });

  const { data, isLoading } = useQuery<
    ApiListResponse<ProductList[]>,
    ApiResponseError
  >({
    queryKey: ["products"],
    queryFn: async () => await getRequest("products/"),
  });

  const { data: productList } = useFilter({
    data: data?.data.results.data as any,
    search: query,
  });

  const metrics = [
    {
      title: "Total Revenue Generated",
      value: analyticsQuery.data?.data.total_profit_generated ?? "0",
      change: "15",
      isPositive: true,
    },
    {
      title: "Average Sales Margin",
      value: formatCurrency(
        parseInt(analyticsQuery.data?.data.total_profit_generated ?? "0"),
        "en-NG",
        "NGN"
      ),
      change: "15",
      isPositive: true,
    },
    {
      title: "Available In Stock",
      value: formatCurrency(
        parseInt(analyticsQuery.data?.data.total_stock_value ?? "0"),
        "en-NG",
        "NGN"
      ),
      change: "4",
    },
    {
      title: "Total Number Of Products",
      value: analyticsQuery.data?.data.total_products.toString() ?? "0",
      change: "17",
      isPositive: true,
    },
  ];

  const columns: ColumnDef<ProductData>[] = [
    { accessorKey: "name", header: "Product Name" },
    { accessorKey: "quantity", header: "Quantity" },
    { accessorKey: "category_name", header: "Category" },
    { accessorKey: "uom", header: "Unit Of Measurement" },
    {
      accessorKey: "expiry_date",
      header: "Expiration Date",
      cell: ({ row }) => {
        const date = format(row.getValue('expiry_date'), 'MMM dd, yyyy');
        return date;
      },
    },
    {
      accessorKey: "selling_price",
      header: "Price (N)",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("selling_price"));
        const formatted = formatCurrency(amount, "en-NG", "NGN");
        return formatted;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return <UpdateProductDialog product={row.original} />;
      },
    },
  ];

  return (
    <Container className="py-10">
      <div className="grid grid-cols-4 gap-7 mt-8">
        <MapList
          data={metrics}
          renderItem={(item) => <MetricCard key={item.title} {...item} />}
        />
      </div>

      <div className="flex items-center justify-between mt-8 mb-3">
        <div className="flex items-center gap-3">
          <TextSearch
            value={query.query}
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, query: e.target.value }))
            }
          />
          {/* <Button variant={"outline"} size={"icon"}>
            <SlidersHorizontal className="w-5 h-5 " />
          </Button> */}
        </div>
        <div className="flex items-center gap-3">
          <CategoryDialog />
          <Button
            onClick={() => navigate("/dashboard/add-product")}
            className="rounded-full"
          >
            <Plus className="w-5 h-5 mr-3" />
            Add Product
          </Button>
        </div>
      </div>

      <DataTable
        data={(productList as any) ?? []}
        columns={columns as any}
        options={{
          disableSelection: true,
          isLoading,
        }}
      />
    </Container>
  );
};
