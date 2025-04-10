import { TextSelect } from "@/components/layouts/FormInputs/TextSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToastHandlers } from "@/hooks/useToaster";
import { postRequest } from "@/lib/axiosInstance";
import { Forger, useForge } from "@/lib/forge";
import { ApiResponse, ApiResponseError } from "@/types";
import { useMutation } from "@tanstack/react-query";
import {
  MapPin,
  SquarePen,
} from "lucide-react";

interface Props {
  id: string
}
type FormValue = {
  status: string;
};

function UpdateCustomOrder(props: Props) {
  const {} = props;
  const handler = useToastHandlers();
  const { ForgeForm } = useForge<FormValue>({});

  const { mutate: createOrder, isPending } = useMutation<
    ApiResponse,
    ApiResponseError,
    FormValue
  >({
    mutationFn: async (values) => {
      return await postRequest(`/orders/custom/${props.id}/`, values);
    },
    onSuccess(data) {
      if (typeof data.data.message === "string") {
        handler.success("Custom Order Update", data.data.message);
      }
    },
    onError(error) {
      handler.error("Custom Order Update", error);
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'icon'} variant={'ghost'}>
          <SquarePen className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="!max-w-xl">
        <DialogHeader>
          <DialogTitle>Update Custom Order</DialogTitle>
        </DialogHeader>

        <ForgeForm onSubmit={createOrder} className="mt-3">
          <div className="mb-3">
            <Forger
              name="status"
              placeholder=""
              // label="Business "
              options={[
                { label: "Pending", value: "pending" },
                { label: "Completed", value: "completed" },
                { label: "Cancelled", value: "cancelled" },
              ]}
              component={TextSelect}
              startAdornment={<MapPin className="h-5 w-5 mr-2 text-gray-400" />}
            />
          </div>

          <DialogFooter className="mt-5 items-end p-0">
            <Button type={"submit"} isLoading={isPending} className="w-fit rounded-full">
              Update
            </Button>
          </DialogFooter>
        </ForgeForm>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateCustomOrder;
