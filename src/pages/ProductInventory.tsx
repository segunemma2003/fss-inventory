import Container from "@/components/layouts/Container";
import { DataTable } from "@/components/layouts/DataTable";
import TextSearch from "@/components/layouts/FormInputs/TextInput";
import { MapList } from "@/components/layouts/MapList";
import { MetricCard } from "@/components/layouts/MetricCard";
import { Button } from "@/components/ui/button";
import { getProducts } from "@/demo";
import { formatCurrency } from "@/lib/utils";
import { ProductData } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { Plus, SlidersHorizontal, Upload } from "lucide-react";
import { useNavigate } from "react-router";

export const ProductInventory = () => {
  const navigate = useNavigate();
  const metrics = [
    {
      title: "Total Revenue Generated",
      value: "58,231",
      change: "15",
      isPositive: true,
    },
    {
      title: "Average  Sales Margin",
      value: formatCurrency(21287.0, "en-NG", "NGN"),
      change: "15",
      isPositive: true,
    },
    {
      title: "Available In Stock",
      value: formatCurrency(212870.0, "en-NG", "NGN"),
      change: "4",
    },
    {
      title: "Total Number Of Products",
      value: "45,231",
      change: "17",
      isPositive: true,
    },
  ];

  const columns: ColumnDef<ProductData>[] = [
    { accessorKey: "product_name", header: "Product Name" },
    { accessorKey: "product_id", header: "Product ID" },
    { accessorKey: "product_category", header: "Category" },
    { accessorKey: "available", header: "Product Qty" },
    { accessorKey: "shelf_life", header: "Shelf Life" },
    {
      accessorKey: "price",
      header: "Price (N)",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("price"));
        const formatted = formatCurrency(amount, "en-NG", "NGN");
        return formatted;
      },
    },
    {
      id: "action",
      header: "ACTION",
      cell: ({ row }) => {
        return (
          <Button
          size={'sm'}
            variant={"outline"}
            className="rounded-full border-primary text-primary"
            onClick={() =>
              navigate("/dashboard/detail", {
                state: { id: row.original.product_id },
              })
            }
          >
            View History
          </Button>
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
          <TextSearch />
          <Button variant={"outline"} size={"icon"}>
            <SlidersHorizontal className="w-5 h-5 " />
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button variant={"ghost"} className="rounded-full">
            <Upload className="w-5 h-5 mr-3" />
            Export
          </Button>
          <Button className="rounded-full">
            <Plus className="w-5 h-5 mr-3" />
            Add Product
          </Button>
        </div>
      </div>

      <DataTable
        data={getProducts(8) ?? []}
        columns={columns}
        options={{
          disableSelection: true,
        }}
      />
    </Container>
  );
};
