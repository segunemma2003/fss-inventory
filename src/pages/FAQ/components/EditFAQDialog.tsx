import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { TextArea } from "@/components/layouts/FormInputs/TextArea";
import { Forger, useForge } from "@/lib/forge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { forwardRef, useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchRequest } from "@/lib/axiosInstance";
import { useToastHandlers } from "@/hooks/useToaster";
import { AxiosError } from "axios";
import { FAQType } from "../index";

interface EditFAQDialogProps {
  children: React.ReactNode;
  faq: FAQType;
  className?: string;
}

const FAQSchema = z
  .object({
    question: z.string().min(1, "Question is required"),
    answer: z.string().min(1, "Answer is required"),
    is_active: z.boolean().optional(),
  });

type FAQFormValues = {
  question: string;
  answer: string;
  is_active?: boolean;
};

export const EditFAQDialog = forwardRef<
  HTMLButtonElement | null,
  EditFAQDialogProps
>(({ children, faq, className }, ref) => {
  const { ForgeForm, setValue } = useForge<FAQFormValues>({
    defaultValues: {
      question: faq.question,
      answer: faq.answer,
      is_active: faq.is_active,
    },
    resolver: zodResolver(FAQSchema),
  });

  const [open, setOpen] = useState(false);
  const toastHandlers = useToastHandlers();
  const queryClient = useQueryClient();

  // Update form values when FAQ prop changes
  useEffect(() => {
    setValue("question", faq.question);
    setValue("answer", faq.answer);
    setValue("is_active", faq.is_active);
  }, [faq, setValue]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: FAQFormValues) => {
      const resp = await patchRequest(`faqs/${faq.id}/`, payload);
      return resp;
    },
    onError: (error: AxiosError) => {
      const err = error?.response as any;
      toastHandlers.error("FAQ", err?.data?.message || "Failed to update FAQ");
    },
    onSuccess: (data) => {
      toastHandlers.success("FAQ", data?.data?.message || "FAQ updated successfully");
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
      setOpen(false);
    },
  });

  const handleSubmit = async (values: FAQFormValues) => {
    await mutateAsync(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={className} ref={ref} asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto border dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">Edit FAQ</DialogTitle>
        </DialogHeader>

        <ForgeForm onSubmit={handleSubmit} className="space-y-4">
          <Forger
            name="question"
            label="Question"
            component={TextInput}
            containerClass=""
            placeholder="Enter the frequently asked question"
          />
          
          <Forger
            name="answer"
            label="Answer"
            component={TextArea}
            containerClass=""
            placeholder="Enter the answer to the question"
            rows={6}
          />

          <Forger
            name="is_active"
            label="Status"
            component={(props: {
              containerClass: string | undefined;
              onChange: any;
              value: boolean;
            }) => (
              <Select
                onValueChange={(value) => props.onChange(value === "true")}
                value={props?.value?.toString()}
              >
                <SelectTrigger className={props?.containerClass}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            )}
            containerClass="mb-3"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isPending}>
              Update FAQ
            </Button>
          </div>
        </ForgeForm>
      </DialogContent>
    </Dialog>
  );
});