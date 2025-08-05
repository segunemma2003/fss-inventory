import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/layouts/DataTable";
import { useToast } from "@/components/ui/use-toast";
import { getRequest, deleteRequest } from "@/lib/axiosInstance";
import TextSearch from "@/components/layouts/FormInputs/TextInput";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Download, Edit, Trash2 } from "lucide-react";
import { ApiListResponse, ApiResponseError } from "@/types";
import { AxiosResponse } from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmAlert } from "@/components/layouts/ConfirmAlert";
import { useFilter } from "@/hooks/useFilter";
import { formatCurrency } from "@/lib/utils";
import EditInvoice from "./EditInvoice";

interface Invoice {
  id: string;
  invoice_number: string;
  business_name: string;
  customer_name: string;
  customer_company: string;
  invoice_date: string;
  due_date: string;
  total_amount: string;
  status: string;
  created_at: string;
}

export function InvoiceManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"create" | "edit" | "view">("view");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [query, setQuery] = useState({
    query: "",
    fields: ["invoice_number", "customer_name", "business_name"],
  });

  // Fetch all invoices
  const { data: invoicesData, isLoading } = useQuery<
    ApiListResponse<Invoice[]>,
    ApiResponseError
  >({
    queryKey: ["invoices"],
    queryFn: async () => await getRequest("/orders/invoices/"),
  });

  const { data: filteredInvoices } = useFilter<any>({
    data: invoicesData?.data?.results?.data || [],
    search: query,
  });

  // Delete invoice mutation
  const deleteInvoiceMutation = useMutation<
    AxiosResponse<{ status: boolean; message: string }>,
    ApiResponseError,
    string
  >({
    mutationFn: async (invoiceId) => {
      return await deleteRequest(`/orders/invoices/${invoiceId}/`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive",
      });
    },
  });

  // Handle download PDF
  const handleDownloadPDF = async (invoiceId: string, invoiceNumber?: string) => {
    try {
      const response = await getRequest(
        `/orders/invoices/download/${invoiceId}/`,
        {
          responseType: 'blob',
        }
      );
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = invoiceNumber ? `${invoiceNumber}.pdf` : `invoice-${invoiceId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "PDF download started",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download PDF",
        variant: "destructive",
      });
    }
  };

  // Handle view/edit invoice
  const handleOpenInvoice = (invoiceId: string, mode: "view" | "edit") => {
    setSelectedInvoice(invoiceId);
    setViewMode(mode);
    setIsDialogOpen(true);
  };

  // Invoice table columns
  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: "invoice_number",
      header: "Invoice #",
      cell: ({ getValue }) => (
        <span className="font-mono text-sm">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "customer_name",
      header: "Customer",
    },
    {
      accessorKey: "customer_company",
      header: "Company",
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-600">
          {(getValue() as string) || "-"}
        </span>
      ),
    },
    {
      accessorKey: "invoice_date",
      header: "Date",
      cell: ({ getValue }) => (
        <span className="text-sm">
          {new Date(getValue() as string).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ getValue }) => (
        <span className="text-sm">
          {new Date(getValue() as string).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: "total_amount",
      header: "Amount",
      cell: ({ getValue }) => (
        <span className="font-medium">
          {formatCurrency(parseFloat(getValue() as string), "en-NG", "NGN")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as string;
        const statusColors = {
          draft: "bg-gray-100 text-gray-800",
          sent: "bg-blue-100 text-blue-800",
          paid: "bg-green-100 text-green-800",
          overdue: "bg-red-100 text-red-800",
          cancelled: "bg-red-100 text-red-800",
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[status as keyof typeof statusColors] ||
              "bg-gray-100 text-gray-800"
            }`}
          >
            {status?.charAt(0).toUpperCase() + status?.slice(1) || "Draft"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleOpenInvoice(invoice.id, "edit")}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownloadPDF(invoice.id, invoice.invoice_number)}
              className="h-8 w-8 p-0"
            >
              <Download className="h-4 w-4" />
            </Button>
            <ConfirmAlert
              text={`Are you sure you want to delete invoice ${invoice.invoice_number}?`}
              title="Delete Invoice"
              onSuccess={() => deleteInvoiceMutation.mutate(invoice.id)}
              trigger={
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
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
    <div className="space-y-6 mt-8 ">
      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TextSearch
                value={query.query}
                onChange={(e) =>
                  setQuery((prev) => ({ ...prev, query: e.target.value }))
                }
                placeholder="Search invoices..."
              />
            </div>
            <div className="text-sm text-gray-600">
              {filteredInvoices?.length || 0} invoice(s) found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardContent className="pt-6">
          <DataTable
            data={filteredInvoices ?? []}
            columns={columns as ColumnDef<unknown>[]}
            options={{
              disableSelection: true,
              isLoading,
            }}
          />
        </CardContent>
      </Card>

      {/* Invoice Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {viewMode === "create"
                ? "Create New Invoice"
                : viewMode === "edit"
                ? "Edit Invoice"
                : "View Invoice"}
            </DialogTitle>
          </DialogHeader>
          <EditInvoice
            invoiceId={selectedInvoice || ""}
            onClose={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default InvoiceManagement;
