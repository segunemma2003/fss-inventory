import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/lib/axiosInstance";
import { ApiResponseError, CustomerResponseData, CustomOrderDetail } from "@/types";
import { AxiosResponse } from "axios";
import { CreateInvoice } from "./CreateInvoice";
import { EditInvoice } from "./EditInvoice";



interface InvoiceViewProps {
  orderId?: string;
  customOrderId?: string;
  invoiceId?: string;
  mode?: 'create' | 'edit';
  onClose?: () => void;
}

export function InvoiceView({ orderId, customOrderId, invoiceId, mode = 'create', onClose }: InvoiceViewProps) {
  // Fetch order data if orderId is provided (for create mode)
  const { data: orderData } = useQuery<
    AxiosResponse<{ status: boolean; message: string; data: CustomerResponseData }>,
    ApiResponseError
  >({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!orderId) throw new Error("No order ID provided");
      return await getRequest(`/orders/${orderId}/`);
    },
    enabled: !!orderId && mode === 'create',
  });

  // Fetch custom order data if customOrderId is provided (for create mode)
  const { data: customOrderData } = useQuery<
    AxiosResponse<{ status: boolean; message: string; data: CustomOrderDetail }>,
    ApiResponseError
  >({
    queryKey: ["customOrder", customOrderId],
    queryFn: async () => {
      if (!customOrderId) throw new Error("No custom order ID provided");
      return await getRequest(`/orders/custom/${customOrderId}/`);
    },
    enabled: !!customOrderId && mode === 'create',
  });

  // Determine which component to render based on mode and props
  if (mode === 'edit' && invoiceId) {
    return <EditInvoice invoiceId={invoiceId} onClose={onClose} />;
  }

  // Default to create mode
  return (
    <CreateInvoice 
      orderData={orderData?.data?.data}
      customOrderData={customOrderData?.data?.data}
      onClose={onClose}
    />
  );
}

export default InvoiceView;