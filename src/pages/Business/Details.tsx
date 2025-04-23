import { BackButton } from "@/components/layouts/BackButton";
import Container from "@/components/layouts/Container";
import { DataTable } from "@/components/layouts/DataTable";
import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToastHandlers } from "@/hooks/useToaster";
import { getRequest, patchRequest } from "@/lib/axiosInstance";
import { Forger, useForge } from "@/lib/forge";
import { formatCurrency } from "@/lib/utils";
import { ApiListResponse, ApiResponse, ApiResponseError, Order } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Edit2, Mail, MapPin, IdCard, Building, User, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { CustomerProductsDialog } from "@/components/dialogs/CustomerProductsDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MetricCard } from "@/components/layouts/MetricCard";

interface Props {}
export interface BusinessPurchaseOrders {
  id: string;
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  payment_method: string;
  payment_method_display: string;
  payment_source: string;
  payment_source_display: string;
  business: string;
  business_name: string;
  status: string;
  status_display: string;
  subtotal: string;
  tax: string;
  total: string;
  notes: string;
  order_date: string;
  created_at: Date;
  updated_at: Date;
  items: Item[];
}

export interface Item {
  id: string;
  product: string;
  product_name: string;
  product_category: string;
  quantity: number;
  price: string;
  subtotal: string;
}

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

function getOrders(data: BusinessPurchaseOrders[]): BusinessPurchaseOrders[] {
  return data.map((item) => ({
    ...item,
  }));
}

interface WalletData {
  id: string;
  business: string;
  business_name: string;
  available_balance: string;
  approved_credit_limit: string;
  total_available_funds: string;
}

interface WalletTransaction {
  id: string;
  wallet: string;
  business_name: string;
  amount: string;
  transaction_type: string;
  description: string;
  reference: string | null;
  performed_by: number;
  performed_by_name: string;
  created_at: string;
}

function CreditLimitDialog({ onSubmit, isLoading }: { onSubmit: (amount: number) => void, isLoading: boolean }) {
  const [amount, setAmount] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit2 className="h-4 w-4 mr-2" />
          Increase Credit Limit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Credit Limit</DialogTitle>
          <DialogDescription>
            Enter the new credit limit amount for this business.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <TextInput
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            type="number"
            placeholder="Enter new credit limit"
            label="Credit Limit"
          />
        </div>
        <DialogFooter>
          <Button
            isLoading={isLoading}
            onClick={() => {
              const newLimit = parseFloat(amount);
              if (!isNaN(newLimit)) {
                onSubmit(newLimit);
              }
            }}
          >
            Update Limit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
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

  const orderQuery = useQuery<ApiListResponse<BusinessPurchaseOrders[]>, ApiResponseError>({
    queryKey: ["business-order"],
    queryFn: async () =>
      await getRequest(`business/${location.state.id}/orders/`),
    refetchOnWindowFocus: false,
  });

  const walletQuery = useQuery<ApiResponse<WalletData>, ApiResponseError>({
    queryKey: ["business-wallet"],
    queryFn: async () => await getRequest(`business/${location.state.id}/wallet/`),
    refetchOnWindowFocus: false,
  });

  const walletTransactionsQuery = useQuery<ApiListResponse<WalletTransaction[]>, ApiResponseError>({
    queryKey: ["business-wallet-transactions"],
    queryFn: async () => await getRequest(`business/${location.state.id}/wallet/transactions/`),
    refetchOnWindowFocus: false,
  });

  const walletAnalyticsQuery = useQuery<ApiResponse<any>, ApiResponseError>({
    queryKey: ["business-wallet-analytics"],
    queryFn: async () => await getRequest(`business/${location.state.id}/wallet/analytics/`),
    refetchOnWindowFocus: false,
  });

  const { mutate, isPending } = useMutation<
    ApiResponse,
    ApiResponseError,
    FormValue
  >({
    mutationFn: async (payload) =>
      await patchRequest(`/business/${location.state.id}/`, payload),
    onSuccess(data) {
      if (typeof data.data.message === "string") {
        Thandler.success("Create Business", data.data.message);
      }
    },
    onError(error) {
      Thandler.error("Registration", error);
    },
  });

  const increaseCreditLimit = useMutation<ApiResponse, ApiResponseError, { credit_limit: number }>({
    mutationFn: async (payload) =>
      await patchRequest(`/business/${location.state.id}/wallet/`, payload),
    onSuccess(data) {
      if (typeof data.data.message === "string") {
        Thandler.success("Credit Limit", data.data.message);
      }
    },
    onError(error) {
      Thandler.error("Credit Limit", error);
    },
  });

  const columns: ColumnDef<BusinessPurchaseOrders>[] = [
    { accessorKey: "customer_name", header: "Customer Name" },
    {
      accessorKey: "customer_phone",
      header: "Customer Phone",
    },
    {
      accessorKey: "payment_method",
      header: "Payment Method",
    },
    {
      accessorKey: "payment_source",
      header: "Payment Source",
    },
    {
      accessorKey: "subtotal",
      header: "Subtotal",
      cell: ({ row }) => {
        return <p className="font-urbanist">
          {formatCurrency(parseInt(row.original.subtotal ?? '0'), "en-NG", "NGN")}
        </p>
      },
    },
    {
      accessorKey: "tax",
      header: "Tax",
      cell: ({ row }) => {
        return <p className="font-urbanist">
          {formatCurrency(parseInt(row.original.tax ?? '0'), "en-NG", "NGN")}
        </p>
      },
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => {
        return <p className="font-urbanist">
          {formatCurrency(parseInt(row.original.total ?? '0'), "en-NG", "NGN")}
        </p>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "action",
      header: "ACTION",
      cell: ({ row }) => {
        return <CustomerProductsDialog customer={row.original.items} />;
      },
    }
  ];

  const transactionColumns: ColumnDef<WalletTransaction>[] = [
    { accessorKey: "business_name", header: "Business" },
    { 
      accessorKey: "amount", 
      header: "Amount",
      cell: ({ row }) => {
        return <p className="font-urbanist">
          {formatCurrency(parseInt(row.original.amount ?? '0'), "en-NG", "NGN")}
        </p>
      }
    },
    { accessorKey: "transaction_type", header: "Type" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "performed_by_name", header: "Performed By" },
    { 
      accessorKey: "created_at", 
      header: "Date",
      cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString()
    },
  ];

  useEffect(() => {
    if (isSuccess) {
      Object.entries(data?.data?.data).map((item) => {
        setValue(item[0] as keyof FormValue, item[1]);
      });
    }
  }, [isSuccess]);

  return (
    <Container as="section">
      <div className="py-4 mb-10 w-fit">
        <BackButton title="Back" />
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <ScrollArea>
          <TabsList className="mb-3">
            <TabsTrigger value="profile">
              <User className="-ms-0.5 me-1.5 opacity-60" size={16} />
              Profile
            </TabsTrigger>
            <TabsTrigger value="wallet">
              <Wallet className="-ms-0.5 me-1.5 opacity-60" size={16} />
              Wallet
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Building className="-ms-0.5 me-1.5 opacity-60" size={16} />
              Orders
            </TabsTrigger>
          </TabsList>
        </ScrollArea>

        <TabsContent value="profile">
          <div className="flex gap-3">
            <div className="flex-1 mb-5">
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
                      <Button type="submit" isLoading={isPending}>
                        <Edit2 />
                        Edit Business Profile
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
        </TabsContent>

        <TabsContent value="wallet">
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <MetricCard
                title="Available Balance"
                value={formatCurrency(parseInt(walletQuery.data?.data?.data?.available_balance ?? '0'), "en-NG", "NGN")}
                change="0"
                isPositive={true}
              />
              <MetricCard
                title="Credit Limit"
                value={formatCurrency(parseInt(walletQuery.data?.data?.data?.approved_credit_limit ?? '0'), "en-NG", "NGN")}
                change="0"
                isPositive={true}
              />
              <MetricCard
                title="Total Available Funds"
                value={formatCurrency(parseInt(walletQuery.data?.data?.data?.total_available_funds ?? '0'), "en-NG", "NGN")}
                change="0"
                isPositive={true}
              />
            </div>

            <Card>
              <CardContent>
                <div className="flex items-center justify-between py-4">
                  <div>
                    <h3 className="text-lg font-semibold">Transaction History</h3>
                    <p className="text-sm text-gray-500">View all wallet transactions</p>
                  </div>
                  <CreditLimitDialog 
                    isLoading={increaseCreditLimit.isPending}
                    onSubmit={(amount) => {
                      increaseCreditLimit.mutate({ credit_limit: amount });
                    }}
                  />
                </div>

                <DataTable
                  data={walletTransactionsQuery.data?.data?.results?.data ?? []}
                  columns={transactionColumns as ColumnDef<unknown>[]}
                  config={{ enableMultiRowSelection: false }}
                  options={{
                    isLoading: walletTransactionsQuery.isLoading,
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <DataTable
            data={getOrders(orderQuery.data?.data?.results?.data ?? []) ?? []}
            columns={columns as ColumnDef<unknown>[]}
            config={{ enableMultiRowSelection: false }}
            options={{
              isLoading,
            }}
          />
        </TabsContent>
      </Tabs>
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
