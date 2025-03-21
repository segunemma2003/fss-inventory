import Container from "@/components/layouts/Container";
import { DataTable } from "@/components/layouts/DataTable";
import TextSearch from "@/components/layouts/FormInputs/TextInput";
import { Button } from "@/components/ui/button";
import { getProductAnalysis } from "@/demo";
import { formatCurrency } from "@/lib/utils";
import { ProductData } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { SlidersHorizontal, Upload } from "lucide-react";
// import { useNavigate } from "react-router";

interface Props {}

export type ProductAnalysisData = Pick<
  ProductData,
  "shelf_life" | "product_id" | 'product_name'
> & {
  quantity_sold: number;
  purchase_price: string;
  profit_earned: string;
  selling_price: string;
};

function SalesAnalytics(props: Props) {
  const {} = props;
  // const _ = useNavigate();

  const columns: ColumnDef<ProductAnalysisData>[] = [
    { accessorKey: "product_name", header: "Product Name" },
    {
      accessorKey: "quantity_sold",
      header: "Quantity Sold",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("quantity_sold"));
        const formatted = formatCurrency(amount, "en-NG", "NGN");
        return formatted;
      },
    },
    {
      accessorKey: "purchase_price",
      header: "Purchase Price",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("purchase_price"));
        const formatted = formatCurrency(amount, "en-NG", "NGN");
        return formatted;
      },
    },
    // {
    //   accessorKey: "profit_earned",
    //   header: "Profit Earned",
    //   cell: ({ row }) => {
    //     const amount = parseFloat(row.getValue("profit_earned"));
    //     const formatted = formatCurrency(amount, "en-NG", "NGN");
    //     return formatted;
    //   },
    // },
    {
      accessorKey: "selling_price",
      header: "Selling Price",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("selling_price"));
        const formatted = formatCurrency(amount, "en-NG", "NGN");
        return formatted;
      },
    },
    { accessorKey: "shelf_life", header: "Shelf Life" },
    // {
    //   id: "action",
    //   header: "ACTION",
    //   cell: ({ row }) => {
    //     return (
    //       <Button
    //         size={"sm"}
    //         variant={"outline"}
    //         className="rounded-full border-primary text-primary"
    //         onClick={() =>
    //           navigate("/dashboard/detail", {
    //             state: { id: row.original.product_id },
    //           })
    //         }
    //       >
    //         View Analysis
    //       </Button>
    //     );
    //   },
    // },
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
            <Upload className="w-5 h-5 mr-3" />
            Export
          </Button>
        </div>
      </div>
      <DataTable
        data={getProductAnalysis(8) ?? []}
        columns={columns as any}
        options={{
          disableSelection: true,
        }}
      />
    </Container>
  );
}

export default SalesAnalytics;
