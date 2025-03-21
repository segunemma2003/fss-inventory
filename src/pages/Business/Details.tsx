import { BackButton } from "@/components/layouts/BackButton";
import Container from "@/components/layouts/Container";
import { DataTable } from "@/components/layouts/DataTable";
import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToastHandlers } from "@/hooks/useToaster";
import { getRequest, patchRequest } from "@/lib/axiosInstance";
import { Forger, useForge } from "@/lib/forge";
import { ApiListResponse, ApiResponse, ApiResponseError, Order } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Mail, MapPin, IdCard, Building, User } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "react-router";

interface Props {}
type BusinessPurchaseOrders = Order;
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

function getOrders(data: Order[]): Order[] {
  return data.map((item) => ({
    ...item,
    business_name: item?.customer_name,
    business_id: item?.customer_name,
    registered_email: item.payment_source,
    cac_number: item.payment_source_display,
    credit_limit: item.business,
  }));
}

function Details(props: Props) {
  const {} = props;
  const location = useLocation();
  const Thandler = useToastHandlers();
  const { ForgeForm, setValue } = useForge<FormValue>({});

  const { data, isLoading, isSuccess } = useQuery<
    ApiResponse<FormValue>,
    ApiResponseError
  >({
    queryKey: ["business-detail"],
    queryFn: async () => await getRequest(`business/${location.state.id}/`),
    refetchOnWindowFocus: false,
  });

  const orderQuery = useQuery<
    ApiListResponse<Order[]>,
    ApiResponseError
  >({
    queryKey: ["business-order"],
    queryFn: async () => await getRequest(`business/${location.state.id}/orders/`),
    refetchOnWindowFocus: false,
  });

  const { mutate } = useMutation<ApiResponse, ApiResponseError, FormValue>({
    mutationFn: async (payload) =>
      await patchRequest("/api/business/create", payload),
    onSuccess(data) {
      if (typeof data.data.message === "string") {
        Thandler.success("Create Business", data.data.message);
      }
      //   queryClient.invalidateQueries({ queryKey: ["businesses"] });
      //   navigate(-1);
    },
    onError(error) {
      Thandler.error("Registration", error);
    },
  });

  const columns: ColumnDef<BusinessPurchaseOrders>[] = [
    { accessorKey: "", header: "Business Name" },
    {
      accessorKey: "id",
      header: "Business ID",
    },
    {
      accessorKey: "registered_email",
      header: "Registered Email",
    },
    {
      accessorKey: "cac_number",
      header: "CAC Number",
    },
    {
      accessorKey: "credit_limit",
      header: "Credit Limit",
    },
  ];

  useEffect(() => {
    if (isSuccess) {
        Object.entries(data?.data?.data).map((item) => {
          setValue(item[0] as keyof FormValue, item[1]);
        })
    }
  }, [isSuccess])

  return (
    <Container as="section">
      <div className="py-4 mb-10">
        <BackButton title="Back" />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <Card>
            <CardContent>
              <HeaderSection />
              <ForgeForm onSubmit={mutate} className="space-y-6 mt-5">
                <div className="grid grid-cols-2 gap-3">
                  <Forger
                    name="name"
                    placeholder="Hom"
                    label="Business Name"
                    component={TextInput}
                    startAdornment={
                      <User className="h-5 w-5 mr-2 text-gray-400" />
                    }
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
                    startAdornment={
                      <IdCard className="h-5 w-5 mr-2 text-gray-400" />
                    }
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
                    startAdornment={
                      <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                    }
                  />
                  <Forger
                    name="email"
                    placeholder="Johndoe@email.com"
                    label="Registered Email"
                    component={TextInput}
                    startAdornment={
                      <Mail className="h-5 w-5 mr-2 text-gray-400" />
                    }
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
                  <Button>
                    <Edit2 />
                    Create Business Profile
                  </Button>
                </div>
              </ForgeForm>
            </CardContent>
          </Card>
        </div>
        {/* <div className="w-[28rem]">
          <Card>
            <CardContent>
              <CardHeader className="flex items-center justify-between p-0">
                <CardTitle>Account Summary</CardTitle>
                <Button variant={"ghost"}>
                  <Edit2 className="w-4 h-4" />
                  Increase Limit
                </Button>
              </CardHeader>
              <div className="mt-5">
                <div className="flex items-center justify-between">
                  <p className="font-urbanist text-base font-semibold">
                    Account Bal
                  </p>
                  <p className="font-urbanist text-base font-semibold">
                    ₦ 10,000,000
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>

      <DataTable
        data={
          getOrders(orderQuery.data?.data?.results?.data ?? []) ?? []
        }
        columns={columns as ColumnDef<unknown>[]}
        config={{ enableMultiRowSelection: false }}
        options={{
          isLoading,
        }}
      />
    </Container>
  );
}

export default Details;

function HeaderSection() {
  return (
    <header className="relative w-full h-32">
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/a832806839054dd344a03e4318ce467ee6b2bb55"
        className="object-cover px-1.5 py-1.5 w-full bg-zinc-300 bg-opacity-60 h-[90px]"
        alt="Header"
      />
      <div className="flex absolute bottom-0 left-4 justify-center items-center px-1.5 py-1 h-14 bg-white rounded border border-red-600 border-solid w-[60px]">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/92a37baa80936f3e4824e2d1621dca06f268ba1c"
          className="object-contain w-12 h-12"
          alt="Logo"
        />
      </div>
    </header>
  );
}
