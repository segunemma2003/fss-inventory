import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText } from "lucide-react";
import { InvoiceView } from "./InvoiceView";

interface InvoiceButtonProps {
  orderId?: string;
  customOrderId?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
}

export function InvoiceButton({ orderId, customOrderId, variant = "outline", size = "sm" }: InvoiceButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className="h-8 w-8 p-0">
          <FileText className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Invoice</DialogTitle>
        </DialogHeader>
        <InvoiceView
          orderId={orderId}
          customOrderId={customOrderId}
          mode="create"
          onClose={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

export default InvoiceButton;