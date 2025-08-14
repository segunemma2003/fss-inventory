import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { DataTable } from "@/components/layouts/DataTable";
import { useToast } from "@/components/ui/use-toast";
import { postRequest } from "@/lib/axiosInstance";
import { Forger, useForge } from "@/lib/forge";
import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Save } from "lucide-react";
import {
  ApiResponseError,
  CustomerResponseData,
  CustomOrderDetail,
} from "@/types";
import { AxiosResponse } from "axios";
// import { useWatch } from "react-hook-form";

type InvoiceItem = CustomerResponseData["items"][0];

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
  // tax_rate: string;
  notes: string;
  terms: string;
  items: InvoiceItem[];
  subtotal?: string;
  tax_amount?: string;
  total_amount?: string;
  status?: string;
}

interface CreateInvoiceProps {
  orderData?: CustomerResponseData;
  customOrderData?: CustomOrderDetail;
  onClose?: () => void;
}

export const CreateInvoice = React.memo<CreateInvoiceProps>(
  function CreateInvoice({ orderData, customOrderData, onClose }) {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Pre-populate data from order if available
    const prePopulatedData = React.useMemo(() => {
      return {
        business_name: "Food Stuff Store",
        business_email: "contact@foodstuffstore.com",
        business_phone: "+1-555-123-4567",
        business_address: "123 Business Street, City, State 12345",
        customer_name:
          orderData?.customer_name || customOrderData?.customer_name || "",
        customer_company: "",
        customer_address:
          orderData?.customer_address ||
          customOrderData?.customer_address ||
          "",
        customer_phone:
          orderData?.customer_phone || customOrderData?.customer_phone || "",
        customer_email: "",
        invoice_date: new Date().toISOString().split("T")[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        tax_rate: orderData?.tax || "0",
        notes: "Thank you for your business!",
        terms: "Payment due within 30 days",
        items: orderData?.items || orderData?.items || [],
      } as InvoiceData;
    }, [orderData, customOrderData]);

    const { ForgeForm, reset } = useForge<InvoiceData>({
    });

    useEffect(() => {
      if(prePopulatedData) {
        reset(prePopulatedData)
      }
    }, [prePopulatedData])

    // Create invoice mutation
    const createInvoiceMutation = useMutation<
      AxiosResponse<{ status: boolean; message: string; data: InvoiceData }>,
      ApiResponseError,
      any
    >({
      mutationFn: async (data) => {
        return await postRequest("/orders/invoices/", data);
      },
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Invoice created successfully",
        });
        queryClient.invalidateQueries({ queryKey: ["invoices"] });
        if (onClose) onClose();
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to create invoice",
          variant: "destructive",
        });
      },
    });

    // Calculate totals - memoized to prevent recalculation on every render
    const calculateTotals = React.useCallback(
      (items: InvoiceItem[], taxRatePercent: number) => {
        const subtotal = items.reduce((sum, item) => {
          const quantity = parseFloat(item.quantity.toString()) || 0;
          const unitPrice = parseFloat(item.price) || 0;
          return sum + quantity * unitPrice;
        }, 0);

        const taxAmount = subtotal * (taxRatePercent / 100);
        const total = subtotal + taxAmount;

        return {
          subtotal: subtotal.toFixed(2),
          taxAmount: taxAmount.toFixed(2),
          total: total.toFixed(2),
        };
      },
      []
    );

    // Handle form submission - memoized to prevent recreation
    const handleSubmit = React.useCallback(
      (formData: InvoiceData) => {
        const invoicePayload = {
          ...formData,
          items: prePopulatedData.items.map((item) => ({
            description: item.product_name,
            quantity: item.quantity,
            unit_price: item.price,
          })),
        };

        createInvoiceMutation.mutate(invoicePayload);
      },
      [createInvoiceMutation, prePopulatedData.items]
    );

    // Line items table columns - memoized to prevent recreation
    const itemColumns = React.useMemo<ColumnDef<InvoiceItem>[]>(
      () => [
        {
          accessorKey: "product",
          header: "PRODUCT NAME",
          cell: ({ row }) => {
            return (
              <span className="font-medium">
                {row.original.product_name || "N/A"}
              </span>
            );
          },
        },
        {
          accessorKey: "quantity",
          header: "QTY",
          cell: ({ row }) => {
            return <span>{row.original.quantity}</span>;
          },
        },
        {
          accessorKey: "price",
          header: "UNIT PRICE",
          cell: ({ row }) => {
            return (
              <span>₦{parseFloat(row.original.price || "0").toFixed(2)}</span>
            );
          },
        },
        {
          id: "amount",
          header: "AMOUNT",
          cell: ({ row }) => {
            const quantity = parseFloat(row.original.quantity.toString()) || 0;
            const unitPrice = parseFloat(row.original.price) || 0;
            const amount = quantity * unitPrice;
            return `₦${amount.toFixed(2)}`;
          },
        },
      ],
      []
    );

    // Memoized totals calculation
    // Memoized DataTable options to prevent recreation
    const dataTableOptions = React.useMemo(
      () => ({
        disablePagination: true,
        disableSelection: true,
        isLoading: false,
        totalCounts: prePopulatedData.items.length,
        manualPagination: false,
        setPagination: () => {},
        pagination: { pageIndex: 0, pageSize: 100 },
      }),
      [prePopulatedData.items.length]
    );

    // Memoized totals calculation
    const totals = React.useMemo(
      () => calculateTotals(prePopulatedData.items, parseFloat("0")),
      [calculateTotals, prePopulatedData.items]
    );

    return (
      <div className="max-w-4xl">
        <div className="">
          <ForgeForm onSubmit={handleSubmit}>
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                <img
                  src="https://cdn.builder.io/api/v1/image/assets/877fbded3c1141a18415be7a6b510b08/a1b8d17c054ef5d488ceefa5dd92f6dac50b4fdb1ceb3d816f63c57dcff44ae5?placeholderIfAbsent=true"
                  alt="Company Logo"
                  className="object-contain h-12 w-auto"
                />
                {/* <div>
                  <h1 className="text-lg font-bold text-gray-800">
                    FOOD STUFF
                  </h1>
                  <h2 className="text-lg font-bold text-gray-800">STORE</h2>
                </div> */}
              </div>

              <div className="text-right">
                <h1 className="text-3xl font-bold text-red-600 mb-2">
                  INVOICE
                </h1>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center justify-end gap-2">
                    <span className="inline-block w-32">Date:</span>
                    <Forger
                      name="invoice_date"
                      component={TextInput}
                      type="date"
                      className="border-0 p-0 h-auto text-sm text-right bg-transparent"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <span className="inline-block w-32">Due Date:</span>
                    <Forger
                      name="due_date"
                      component={TextInput}
                      type="date"
                      className="border-0 p-0 h-auto text-sm text-right bg-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

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
                <h3 className="text-sm font-bold text-green-600 mb-3">
                  BILL TO:
                </h3>
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
                data={prePopulatedData.items}
                columns={itemColumns as ColumnDef<unknown>[]}
                options={dataTableOptions}
              />
            </div>

            {/* Totals Section */}
            <div className="flex justify-end mb-8">
              <div className="w-60">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₦{totals.subtotal}</span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span>
                      Tax (
                      <Forger
                        name="tax_rate"
                        component="input"
                        type="number"
                        className="border-0 p-0 bg-transparent inline-block w-15"
                      />
                      )%:
                    </span>
                    <span>₦{totals.taxAmount}</span>
                  </div> */}
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
            <div className="flex justify-end mt-8 gap-2 no-print">
              {/* Close Button */}
              {onClose && (
                <Button onClick={onClose} variant="outline">
                  Close
                </Button>
              )}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={createInvoiceMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {createInvoiceMutation.isPending
                    ? "Creating..."
                    : "Create Invoice"}
                </Button>
              </div>
            </div>
          </ForgeForm>
        </div>
      </div>
    );
  }
);

export default CreateInvoice;
