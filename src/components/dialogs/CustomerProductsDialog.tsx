import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Eye } from "lucide-react";
import { Item } from "@/pages/Business/Details";

interface CustomerProductsDialogProps {
  customer: Item[];
}

export function CustomerProductsDialog({ customer }: CustomerProductsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-urbanist">Customer Products</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableHeader className="bg-accent">
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customer.map((item) => (
                <TableRow key={item.id} className="bg-white">
                  <TableCell className="font-medium">{item.product_name}</TableCell>
                  <TableCell>{item.product_category}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="font-urbanist">
                    {formatCurrency(parseInt(item.price), "en-NG", "NGN")}
                  </TableCell>
                  <TableCell className="font-urbanist">
                    {formatCurrency(parseInt(item.subtotal), "en-NG", "NGN")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end">
            <p className="text-sm text-muted-foreground">
              Total Items: {customer.length}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 