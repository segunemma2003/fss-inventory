import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TextArea, TextInput } from "@/components/layouts/FormInputs/TextInput";
import { useToastHandlers } from "@/hooks/useToaster";
import { postRequest } from "@/lib/axiosInstance";
import { ApiResponse, ApiResponseError } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Forger, useForge } from "@/lib/forge";

type FormValue = {
  name: string;
  description: string;
};

export const CategoryDialog = () => {
  const [open, setOpen] = useState(false);
  const { success, error } = useToastHandlers();
  const queryClient = useQueryClient();
  const { ForgeForm } = useForge<FormValue>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const mutation = useMutation<ApiResponse, ApiResponseError, FormValue>({
    mutationFn: async (data) => {
      const response = await postRequest("products/categories/", {
        name: data.name,
        description: data.description,
        "image": ""
      });
      return response.data;
    },
    onSuccess: () => {
      success("Success", "Category created successfully");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => {
      error("Error", err);
    },
  });

  const handleSubmit = (values: FormValue) => {
    if (!values.name.trim()) {
      error("Error", "Category name is required");
      return;
    }
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full">
          <Plus className="w-5 h-5 mr-3" />
          Add Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>
            Add a new category for organizing products
          </DialogDescription>
        </DialogHeader>
        <ForgeForm onSubmit={handleSubmit} className="space-y-4">
          <Forger
            name="name"
            component={TextInput}
            placeholder="Enter category name"
          />
          <Forger
            name="description"
            component={TextArea}
            placeholder="Enter category description (optional)"
            rows={4}
          />
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={mutation.isPending}>
              Create Category
            </Button>
          </div>
        </ForgeForm>
      </DialogContent>
    </Dialog>
  );
}; 