import { BackButton } from "@/components/layouts/BackButton";
import Container from "@/components/layouts/Container";
import { TextInput } from "@/components/layouts/FormInputs/TextInput";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToastHandlers } from "@/hooks/useToaster";
import { postRequest } from "@/lib/axiosInstance";
import { Forger, useForge } from "@/lib/forge";
import { ApiResponse, ApiResponseError } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit2, Mail, MapPin, IdCard, Building, User } from "lucide-react";
import { useNavigate } from "react-router";

interface Props {}
interface FormValue {
  name: string;
  email: string;
  phone: string;
  address: string;
  business_type: string;
  industry: string;
  cac_number: string;
  website: string;
}

function Create(props: Props) {
  const {} = props;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const Thandler = useToastHandlers();
  const { ForgeForm } = useForge<FormValue>({});

  const { mutate, isPending } = useMutation<ApiResponse, ApiResponseError, FormValue>({
    mutationFn: async (payload) =>
      await postRequest("/business/", payload),
    onSuccess(data) {
      if (typeof data.data.message === "string") {
        Thandler.success("Create Business", data.data.message);
      }
      queryClient.invalidateQueries({ queryKey: ["businesses"] });
      navigate(-1);
    },
    onError(error) {
      Thandler.error("Create Business", error);
    },
  });

  return (
    <Container as="section">
      <div className="py-4 mb-10 w-fit">
        <BackButton title="Back" />
      </div>

      <div>
        <h4 className="font-urbanist text-2xl font-semibold text-primary">
          Create Business Profile
        </h4>
        {/* <p className="font-urbanist text-base font-semibold">Profile Picture</p> */}

        {/* <div className="flex items-start gap-5 mt-4">
          <Avatar className="w-40 h-40">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h6 className="font-urbanist font-light text-sm">
              Edit profile picture
            </h6>
            <Button variant={"ghost"} className="mt-1">
              <Edit2 className="" />
              Change
            </Button>
          </div>
        </div> */}

        <ForgeForm onSubmit={mutate} className="space-y-6 mt-5">
          <div className="grid grid-cols-2 gap-3">
            <Forger
              name="name"
              placeholder="Hom"
              label="Business Name"
              component={TextInput}
              startAdornment={<User className="h-5 w-5 mr-2 text-gray-400" />}
            />
            <Forger
              name="business_type"
              placeholder="retail"
              label="Business Type"
              component={TextInput}
              startAdornment={
                <Building className="h-5 w-5 mr-2 text-gray-400" />
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Forger
              name="cac_number"
              placeholder="EE12345"
              label="CAC Number"
              component={TextInput}
              startAdornment={<IdCard className="h-5 w-5 mr-2 text-gray-400" />}
            />
            <Forger
              name="industry"
              placeholder="EE12345"
              label="Industry"
              component={TextInput}
              startAdornment={
                <Building className="h-5 w-5 mr-2 text-gray-400" />
              }
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Forger
              name="address"
              placeholder="Site 2 along Bullion Avenue"
              label="Business Address"
              component={TextInput}
              startAdornment={<MapPin className="h-5 w-5 mr-2 text-gray-400" />}
            />
            <Forger
              name="email"
              placeholder="Johndoe@email.com"
              label="Registered Email"
              component={TextInput}
              startAdornment={<Mail className="h-5 w-5 mr-2 text-gray-400" />}
            />
            <Forger
              name="phone"
              placeholder="123456789"
              type="tel"
              label="Registered Phone Number"
              component={TextInput}
            />
          </div>
          {/* <p className="font-bold text-xl font-urbanist mt-5">Account Information: Kindly Provide This Business Credit Balance Information</p>
            <div className="grid grid-cols-3 gap-3">
                <Forger name="" />
            </div> */}

          <div className="">
            <Button type='submit' isLoading={isPending}>
              <Edit2 />
              Create Business Profile
            </Button>
          </div>
        </ForgeForm>
      </div>
    </Container>
  );
}

export default Create;
