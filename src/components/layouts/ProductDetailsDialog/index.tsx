import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { ProductData } from "@/types";
import { Eye, Package, Calendar, DollarSign, TrendingUp, Warehouse, Tag } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";

interface ProductDetailsDialogProps {
  product: ProductData;
}

interface DetailedProductData extends ProductData {
  total_value: string;
  total_profit_potential: string;
  days_until_expiry: number;
  is_expired: boolean;
}

export const ProductDetailsDialog = ({ product }: ProductDetailsDialogProps) => {
  const [open, setOpen] = useState(false);

  // Fetch detailed product information when dialog opens
  const { data: detailedProduct, isLoading } = useQuery<
    ApiResponse<DetailedProductData>,
    ApiResponseError
  >({
    queryKey: ["product-details", product.id],
    queryFn: async () => await getRequest(`products/${product.id}/`),
    enabled: open, // Only fetch when dialog is open
  });

  const productDetails = detailedProduct?.data.data || product;
  const expiryDate = new Date(productDetails.expiry_date);
  const daysUntilExpiry = differenceInDays(expiryDate, new Date());
  const isExpired = daysUntilExpiry < 0;
  const isExpiringSoon = daysUntilExpiry <= 30 && daysUntilExpiry > 0;

  const getExpiryStatus = () => {
    if (isExpired) return { label: "Expired", variant: "destructive" as const };
    if (isExpiringSoon) return { label: "Expiring Soon", variant: "secondary" as const };
    return { label: "Fresh", variant: "default" as const };
  };

  const getStockStatus = () => {
    if (productDetails.quantity === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (productDetails.quantity <= 10) return { label: "Low Stock", variant: "secondary" as const };
    return { label: "In Stock", variant: "default" as const };
  };

  const expiryStatus = getExpiryStatus();
  const stockStatus = getStockStatus();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="h-8 w-8 p-0">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Product Details
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Product Header */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Product Image */}
              <div className="lg:w-1/3">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border dark:border-gray-700">
                  {productDetails.image ? (
                    <img
                      src={productDetails.image}
                      alt={productDetails.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NyA3NEg2M0M2MS44OTU0IDc0IDYxIDc0Ljg5NTQgNjEgNzZWMTAwQzYxIDEwMS4xMDUgNjEuODk1NCAxMDIgNjMgMTAySDg3Qzg4LjEwNDYgMTAyIDg5IDEwMS4xMDUgODkgMTAwVjc2Qzg5IDc0Ljg5NTQgODguMTA0NiA3NCA4NyA3NFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEzNyA3NEgxMTNDMTExLjg5NSA3NCAxMTEgNzQuODk1NCAxMTEgNzZWMTAwQzExMSAxMDEuMTA1IDExMS44OTUgMTAyIDExMyAxMDJIMTM3QzEzOC4xMDUgMTAyIDEzOSAxMDEuMTA1IDEzOSAxMDBWNzZDMTM5IDc0Ljg5NTQgMTM4LjEwNSA3NCAxMzcgNzRaIiBmaWxsPSIjOUNBM0FGIi8+CjxwYXRoIGQ9Ik04NyAxMjRINjNDNjEuODk1NCAxMjQgNjEgMTI0Ljg5NSA2MSAxMjZWMTUwQzYxIDE1MS4xMDUgNjEuODk1NCAxNTIgNjMgMTUySDg3Qzg4LjEwNDYgMTUyIDg5IDE1MS4xMDUgODkgMTUwVjEyNkM4OSAxMjQuODk1IDg4LjEwNDYgMTI0IDg3IDEyNFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTEzNyAxMjRIMTEzQzExMS44OTUgMTI0IDExMSAxMjQuODk1IDExMSAxMjZWMTUwQzExMSAxNTEuMTA1IDExMS44OTUgMTUyIDExMyAxNTJIMTM3QzEzOC4xMDUgMTUyIDEzOSAxNTEuMTA1IDEzOSAxNTBWMTI2QzEzOSAxMjQuODk1IDEzOC4xMDUgMTI0IDEzNyAxMjRaIiBmaWxsPSIjOUNBM0FGIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTEwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjc3NDhGIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                      <Package className="w-16 h-16" />
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="lg:w-2/3 space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {productDetails.name}
                  </h1>
                  {productDetails.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                      {productDetails.description}
                    </p>
                  )}
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant={stockStatus.variant} className="px-3 py-1">
                    <Warehouse className="w-3 h-3 mr-1" />
                    {stockStatus.label}
                  </Badge>
                  <Badge variant={expiryStatus.variant} className="px-3 py-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    {expiryStatus.label}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    <Tag className="w-3 h-3 mr-1" />
                    {productDetails.category_name}
                  </Badge>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Selling Price</p>
                          <p className="text-xl font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(parseFloat(productDetails.selling_price), "en-NG", "NGN")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Stock Quantity</p>
                          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {productDetails.quantity} {productDetails.uom}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <Separator />

            {/* Detailed Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Financial Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Financial Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {productDetails.cost_price && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Cost Price:</span>
                      <span className="font-semibold dark:text-white">
                        {formatCurrency(parseFloat(productDetails.cost_price), "en-NG", "NGN")}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Selling Price:</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {formatCurrency(parseFloat(productDetails.selling_price), "en-NG", "NGN")}
                    </span>
                  </div>
                  {productDetails.cost_price && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Profit Margin:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(
                          parseFloat(productDetails.selling_price) - parseFloat(productDetails.cost_price),
                          "en-NG",
                          "NGN"
                        )}
                      </span>
                    </div>
                  )}
                  {(detailedProduct?.data.data as DetailedProductData)?.total_value && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Total Stock Value:</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {formatCurrency(
                          parseFloat((detailedProduct?.data.data as DetailedProductData)?.total_value || "0"),
                          "en-NG",
                          "NGN"
                        )}
                      </span>
                    </div>
                  )}
                  {(detailedProduct?.data.data as DetailedProductData)?.total_profit_potential && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">Profit Potential:</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(
                          parseFloat((detailedProduct?.data.data as DetailedProductData)?.total_profit_potential || "0"),
                          "en-NG",
                          "NGN"
                        )}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Inventory Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Warehouse className="w-5 h-5" />
                    <span>Inventory Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Current Stock:</span>
                    <span className="font-semibold dark:text-white">
                      {productDetails.quantity} {productDetails.uom}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Unit of Measurement:</span>
                    <span className="font-semibold dark:text-white">{productDetails.uom}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Category:</span>
                    <Badge variant="outline">{productDetails.category_name}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Expiry Date:</span>
                    <span className={`font-semibold ${
                      isExpired ? 'text-red-600 dark:text-red-400' : isExpiringSoon ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'
                    }`}>
                      {format(expiryDate, 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Days Until Expiry:</span>
                    <span className={`font-semibold ${
                      isExpired ? 'text-red-600 dark:text-red-400' : isExpiringSoon ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'
                    }`}>
                      {isExpired ? `Expired ${Math.abs(daysUntilExpiry)} days ago` : `${daysUntilExpiry} days`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Information */}
            {detailedProduct?.data.data && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Performance Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Stock Status</p>
                      <p className={`text-lg font-bold ${
                        productDetails.quantity === 0 ? 'text-red-600 dark:text-red-400' : 
                        productDetails.quantity <= 10 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'
                      }`}>
                        {stockStatus.label}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Freshness</p>
                      <p className={`text-lg font-bold ${
                        isExpired ? 'text-red-600 dark:text-red-400' : isExpiringSoon ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'
                      }`}>
                        {expiryStatus.label}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Category</p>
                      <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {productDetails.category_name}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};