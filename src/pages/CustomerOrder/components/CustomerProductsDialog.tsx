import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Package, ShoppingBag } from "lucide-react";
import { CustomerOverview } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface CustomerProductsDialogProps {
  customer: CustomerOverview;
}

export function CustomerProductsDialog({ customer }: CustomerProductsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">View Products</span>
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {`${customer.first_name} ${customer.last_name}'s Products`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{customer.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Phone</p>
              <p className="text-sm text-muted-foreground">{customer.phone_number}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Total Purchases</p>
              <p className="text-sm text-muted-foreground">{customer.total_purchases}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Total Amount Spent</p>
              <p className="text-sm text-muted-foreground">{formatCurrency(customer.total_amount_spent, "en-NG", "NGN")}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Purchase Frequency</p>
              <p className="text-sm text-muted-foreground">{customer.purchase_frequency}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Last Purchase</p>
              <p className="text-sm text-muted-foreground">
                {new Date(customer.last_purchase_date).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <h3 className="text-lg font-medium mt-6 mb-3">Products Purchased</h3>
          
          <div className="grid grid-cols-1 gap-5">
            {customer.products_bought.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow border-slate-200">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 p-4 flex items-center justify-center bg-slate-50">
                    <div className="relative w-full aspect-square max-w-[180px]">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-slate-100 to-slate-200 rounded-md">
                          <ShoppingBag className="h-10 w-10 text-slate-400 mb-2" strokeWidth={1.5} />
                          <span className="text-sm font-medium text-slate-500 bg-white px-2 py-1 rounded-md">
                            {product.name.substring(0, 2).toUpperCase()}
                          </span>
                          <div className="absolute inset-0 border border-dashed border-slate-300 rounded-md opacity-60"></div>
                        </div>
                      )}
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none">
                          {product.category_name}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 p-5">
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <h4 className="font-medium text-lg mb-1">{product.name}</h4>
                        <p className="text-slate-500 text-sm mb-4">{product.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {product.tags.map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs px-2 py-0 bg-slate-50">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3">
                          <div className="text-xs text-slate-500">Unit of Measure</div>
                          <Badge variant="secondary" className="text-xs font-normal">
                            {product.uom}
                          </Badge>
                        </div>
                        <div className="text-lg font-semibold text-emerald-700">
                          {formatCurrency(product.selling_price, "en-NG", "NGN")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 