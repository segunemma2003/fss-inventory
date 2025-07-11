import Container from "@/components/layouts/Container";
import { DataTable } from "@/components/layouts/DataTable";
import TextSearch from "@/components/layouts/FormInputs/TextInput";
import { TextSelect } from "@/components/layouts/FormInputs/TextSelect";
import { MapList } from "@/components/layouts/MapList";
import { MetricCard } from "@/components/layouts/MetricCard";
import { Button } from "@/components/ui/button";
import { useFilter } from "@/hooks/useFilter";
import { getRequest } from "@/lib/axiosInstance";
import { formatCurrency } from "@/lib/utils";
import { ApiListResponse, ApiResponseError, ApiResponse, ProductData } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { AxiosResponse } from "axios";
import { format } from "date-fns";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { CategoryDialog } from "@/components/layouts/CategoryDialog";
import { UpdateProductDialog } from "@/components/layouts/UpdateProductDialog";
import { ProductDetailsDialog } from "@/components/layouts/ProductDetailsDialog";
import { ConfirmAlert } from "@/components/layouts/ConfirmAlert";
import { Trash2 } from "lucide-react";

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

export interface Category {
  id: string;
  name: string;
  description: string;
}

export const ProductInventory = () => {
  const [query, setQuery] = useState({
    query: "",
    fields: ["name", "category_name"],
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const analyticsQuery = useQuery<
    AxiosResponse<ProductAnalytics>,
    ApiResponseError
  >({
    queryKey: ["analytics"],
    queryFn: async () => await getRequest("products/analytics/"),
  });

  const categoryQuery = useQuery<ApiResponse<Category[]>, ApiResponseError>({
    queryKey: ["categories"],
    queryFn: async () => await getRequest("products/categories"),
  });

  const { data, isLoading } = useQuery<
    ApiListResponse<ProductList[]>,
    ApiResponseError
  >({
    queryKey: ["products", selectedCategory],
    queryFn: async () => {
      const params = selectedCategory ? { category: selectedCategory } : {};
      return await getRequest("products/", { params });
    },
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
        return (
          <div className="flex items-center gap-2">
            <ProductDetailsDialog product={row.original} />
            <UpdateProductDialog product={row.original} />
            <ConfirmAlert
              url={`products/${row.original.id}/`}
              title="Delete Product"
              text={`Are you sure you want to delete "${row.original.name}"? This action cannot be undone.`}
              icon={Trash2}
              onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["products"] });
                queryClient.invalidateQueries({ queryKey: ["analytics"] });
              }}
              trigger={
                <Button size="sm" variant="destructive" className="h-8 w-8 p-0">
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
            />
          </div>
        );
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
          <div className="w-64">
            <TextSelect
              name="category"
              placeholder="Filter by category"
              value={selectedCategory || "all"}
              onChange={(e) => {
                const value = e.target.value === "all" ? "" : e.target.value;
                setSelectedCategory(value);
              }}
              options={[
                { label: "All Categories", value: "all" },
                ...(categoryQuery.data?.data.data.map((category) => ({
                  label: category.name,
                  value: category.name.toLowerCase(),
                })) ?? []),
              ]}
            />
          </div>
          {selectedCategory && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory("")}
              className="h-10"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Filter
            </Button>
          )}
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
