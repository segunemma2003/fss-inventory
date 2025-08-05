import { useRef, useMemo, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/layouts/DataTable";
import { useToast } from "@/components/ui/use-toast";
import { getRequest, putRequest } from "@/lib/axiosInstance";
import { Forger, useForge } from "@/lib/forge";
import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Save, X } from "lucide-react";
import { ApiResponseError } from "@/types";
import { AxiosResponse } from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useWatch } from "react-hook-form";

interface InvoiceItem {
  id?: string;
  description: string;
  quantity: string;
  unit_price: string;
  total_amount?: string;
  product?: any;
}

interface InvoiceData {
  id?: string;
  invoice_number?: string;
  business_name: string;
  business_email: string;
  business_phone: string;
  business_address: string;
  customer_name: string;
  customer_company: string;
  customer_address: string;
  customer_phone: string;
  customer_email: string;
  invoice_date: string;
  due_date: string;
  tax_rate: string;
  notes: string;
  terms: string;
  items: InvoiceItem[];
  subtotal?: string;
  tax_amount?: string;
  total_amount?: string;
  status?: string;
}

interface EditInvoiceProps {
  invoiceId: string;
  onClose?: () => void;
}

export function EditInvoice({ invoiceId, onClose }: EditInvoiceProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const printRef = useRef<HTMLDivElement>(null);

  // Fetch invoice data
  const { data: invoiceData, isLoading, error } = useQuery<
    AxiosResponse<{ status: boolean; message: string; data: InvoiceData }>,
    ApiResponseError
  >({
    queryKey: ["invoice", invoiceId],
    queryFn: async () => {
      return await getRequest(`/orders/invoices/${invoiceId}/`);
    },
    enabled: !!invoiceId,
  });

  const invoice = invoiceData?.data?.data;

  // Compute default values from invoice data
  const defaultValues = useMemo(() => {
    if (!invoice) {
      return {
        business_name: "",
        business_email: "",
        business_phone: "",
        business_address: "",
        customer_name: "",
        customer_company: "",
        customer_address: "",
        customer_phone: "",
        customer_email: "",
        invoice_date: "",
        due_date: "",
        tax_rate: "",
        notes: "",
        terms: "",
        items: []
      };
    }

    return {
      ...invoice,
      tax_rate: (parseFloat(invoice.tax_rate || "0") * 100).toString(),
      items: invoice.items?.map(item => ({
        ...item,
        quantity: item.quantity?.toString() || "1",
        unit_price: item.unit_price?.toString() || "0.00"
      })) || []
    };
  }, [invoice]);

  const { ForgeForm, control, setValue, reset } = useForge<InvoiceData>({
    defaultValues,
    mode: "onChange"
  });

  // Reset form when invoice data is loaded
  useEffect(() => {
    if (invoice) {
      const formData = {
        ...invoice,
        tax_rate: (parseFloat(invoice.tax_rate || "0") * 100).toString(),
        items: invoice.items?.map(item => ({
          ...item,
          quantity: item.quantity?.toString() || "1",
          unit_price: item.unit_price?.toString() || "0.00"
        })) || []
      };
      reset(formData);
    }
  }, [invoice, reset]);

  // Watch form values for reactive updates
  const formItems = useWatch({ control, name: "items" }) || [];
  const formTaxRate = useWatch({ control, name: "tax_rate" }) || "7.50";

  // Use form state directly for table operations
  const invoiceItems = formItems.length > 0 ? formItems : [];

  // Update invoice mutation
  const updateInvoiceMutation = useMutation<
    AxiosResponse<{ status: boolean; message: string; data: InvoiceData }>,
    ApiResponseError,
    InvoiceData
  >({
    mutationFn: async (data) => {
      return await putRequest(`/orders/invoices/${invoiceId}/`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] });
      if (onClose) onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update invoice",
        variant: "destructive",
      });
    },
  });

  // Calculate totals
  const calculateTotals = (items: InvoiceItem[], taxRatePercent: number) => {
    const subtotal = items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const unitPrice = parseFloat(item.unit_price) || 0;
      return sum + (quantity * unitPrice);
    }, 0);
    
    const taxAmount = subtotal * (taxRatePercent / 100);
    const total = subtotal + taxAmount;
    
    return {
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      total: total.toFixed(2)
    };
  };

  // Handle form submission
  const handleSubmit = (formData: InvoiceData) => {
    const invoicePayload = {
      ...formData,
      tax_rate: (parseFloat(formData.tax_rate || "0") / 100).toString(),
      items: formData.items || []
    };

    updateInvoiceMutation.mutate(invoicePayload);
  };

  // Update items in form state
  const updateFormItems = (newItems: InvoiceItem[]) => {
    setValue("items", newItems);
  };

  // Line items table columns
  const itemColumns: ColumnDef<InvoiceItem>[] = [
    {
      accessorKey: "description",
      header: "DESCRIPTION",
      cell: ({ row, getValue }) => {
        return (
          <Input
            value={getValue() as string}
            onChange={(e) => {
              const newItems = [...invoiceItems];
              newItems[row.index].description = e.target.value;
              updateFormItems(newItems);
            }}
            className="border-0 p-0 h-auto"
            placeholder="Item description"
          />
        );
      },
    },
    {
      accessorKey: "quantity",
      header: "QTY",
      cell: ({ row, getValue }) => {
        return (
          <Input
            type="number"
            value={getValue() as string}
            onChange={(e) => {
              const newItems = [...invoiceItems];
              newItems[row.index].quantity = e.target.value;
              updateFormItems(newItems);
            }}
            className="border-0 p-0 h-auto w-20"
            min="0"
          />
        );
      },
    },
    {
      accessorKey: "unit_price",
      header: "UNIT PRICE",
      cell: ({ row, getValue }) => {
        return (
          <Input
            type="number"
            step="0.01"
            value={getValue() as string}
            onChange={(e) => {
              const newItems = [...invoiceItems];
              newItems[row.index].unit_price = e.target.value;
              updateFormItems(newItems);
            }}
            className="border-0 p-0 h-auto w-24"
            min="0"
          />
        );
      },
    },
    {
      id: "amount",
      header: "AMOUNT",
      cell: ({ row }) => {
        const quantity = parseFloat(row.original.quantity) || 0;
        const unitPrice = parseFloat(row.original.unit_price) || 0;
        const amount = quantity * unitPrice;
        return `₦${amount.toFixed(2)}`;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            const newItems = invoiceItems.filter((_, index) => index !== row.index);
            updateFormItems(newItems);
          }}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  // Add new item
  const addNewItem = () => {
    const newItems = [...invoiceItems, {
      description: "",
      quantity: "1",
      unit_price: "0.00"
    }];
    updateFormItems(newItems);
  };

  const totals = calculateTotals(invoiceItems, parseFloat(formTaxRate));

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="w-full">
          <CardContent className="p-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="w-full">
          <CardContent className="p-8">
            <div className="text-center">
              <p className="text-red-600">Failed to load invoice data</p>
              {onClose && (
                <Button onClick={onClose} className="mt-4">
                  Close
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="">

      {/* Invoice Content */}
      <div ref={printRef}>
        <Card className="w-full">
          <CardContent className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/877fbded3c1141a18415be7a6b510b08/a1b8d17c054ef5d488ceefa5dd92f6dac50b4fdb1ceb3d816f63c57dcff44ae5?placeholderIfAbsent=true"
                  alt="Company Logo"
                  className="object-contain h-12 w-auto"
                />
                <div>
                  <h1 className="text-lg font-bold text-gray-800">FOOD STUFF</h1>
                  <h2 className="text-lg font-bold text-gray-800">STORE</h2>
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-3xl font-bold text-red-600 mb-2">INVOICE</h1>
                <div className="text-sm text-gray-600">
                  <p>Invoice #: {invoice.invoice_number || 'FSS-XXXX-XXXXXX'}</p>
                  <p>Date: {invoice.invoice_date ? new Date(invoice.invoice_date).toLocaleDateString() : new Date().toLocaleDateString()}</p>
                  <p>Due Date: {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <ForgeForm onSubmit={handleSubmit}>
              {/* From / Bill To Section */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-sm font-bold text-green-600 mb-3">FROM:</h3>
                  <div className="space-y-2">
                    <Forger
                      name="business_name"
                      component={TextInput}
                      placeholder="Your Company Name"
                      className="border-0 p-0 h-auto font-medium"
                    />
                    <Forger
                      name="business_address"
                      component={TextInput}
                      placeholder="Business Address"
                      className="border-0 p-0 h-auto text-sm"
                    />
                    <Forger
                      name="business_phone"
                      component={TextInput}
                      placeholder="Business Phone"
                      className="border-0 p-0 h-auto text-sm"
                    />
                    <Forger
                      name="business_email"
                      component={TextInput}
                      placeholder="Business Email"
                      className="border-0 p-0 h-auto text-sm"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-green-600 mb-3">BILL TO:</h3>
                  <div className="space-y-2">
                    <Forger
                      name="customer_name"
                      component={TextInput}
                      placeholder="Customer Name"
                      className="border-0 p-0 h-auto font-medium"
                      required
                      rules={{ required: "Customer name is required" }}
                    />
                    <Forger
                      name="customer_company"
                      component={TextInput}
                      placeholder="Customer Company"
                      className="border-0 p-0 h-auto text-sm"
                    />
                    <Forger
                      name="customer_address"
                      component={TextInput}
                      placeholder="Customer Address"
                      className="border-0 p-0 h-auto text-sm"
                    />
                    <Forger
                      name="customer_phone"
                      component={TextInput}
                      placeholder="Customer Phone"
                      className="border-0 p-0 h-auto text-sm"
                    />
                    <Forger
                      name="customer_email"
                      component={TextInput}
                      placeholder="Customer Email"
                      className="border-0 p-0 h-auto text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="mb-8">
                <DataTable
                  data={invoiceItems}
                  columns={itemColumns as ColumnDef<unknown>[]}
                  options={{
                    disablePagination: true,
                    disableSelection: true,
                    isLoading: false,
                    totalCounts: invoiceItems.length,
                    manualPagination: false,
                    setPagination: () => {},
                    pagination: { pageIndex: 0, pageSize: 100 }
                  }}
                />
                
                <Button
                  type="button"
                  onClick={addNewItem}
                  variant="outline"
                  className="mt-4"
                >
                  Add Item
                </Button>
              </div>

              {/* Tax Rate Input */}
              <div className="flex justify-end mb-4">
                <div className="w-80">
                  <div className="flex items-center gap-2 mb-2">
                    <label className="text-sm font-medium">Tax Rate (%):</label>
                    <Forger
                      name="tax_rate"
                      component={Input}
                      type="number"
                      step="0.01"
                      className="w-20 h-8"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              {/* Totals Section */}
              <div className="flex justify-end mb-8">
                <div className="w-80">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₦{totals.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax ({formTaxRate}%):</span>
                      <span>₦{totals.taxAmount}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg text-red-600">
                      <span>TOTAL:</span>
                      <span>₦{totals.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes and Terms */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-bold mb-2">Notes:</h4>
                  <Forger
                    name="notes"
                    component={Textarea}
                    placeholder="Thank you for your business!"
                    className="min-h-[80px]"
                  />
                </div>
                <div>
                  <h4 className="font-bold mb-2">Terms:</h4>
                  <Forger
                    name="terms"
                    component={Textarea}
                    placeholder="Payment due within 30 days"
                    className="min-h-[80px]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end mt-8 no-print">
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={updateInvoiceMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {updateInvoiceMutation.isPending ? "Updating..." : "Update Invoice"}
                  </Button>
                </div>
              </div>
            </ForgeForm>
          </CardContent>
        </Card>
      </div>

      {/* Close Button */}
      {onClose && (
        <div className="flex justify-end mt-6 no-print">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      )}
    </div>
  );
}

export default EditInvoice;