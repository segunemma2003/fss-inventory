import Container from "@/components/layouts/Container";
import { DataTable } from "@/components/layouts/DataTable";
import TextSearch from "@/components/layouts/FormInputs/TextInput";
import { Button } from "@/components/ui/button";
import { getRequest } from "@/lib/axiosInstance";
import { ApiListResponse, ApiResponseError } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, Plus, MessageCircleQuestion } from "lucide-react";
import { useState } from "react";
import { AddFAQDialog } from "./components/AddFAQDialog";
import { EditFAQDialog } from "./components/EditFAQDialog";
import { ConfirmAlert } from "@/components/layouts/ConfirmAlert";

export type FAQType = {
  id: number;
  question: string;
  answer: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

const FAQ = () => {
  const [query, setQuery] = useState({
    query: "",
    fields: ["question", "answer"],
  });

  const { data, isLoading } = useQuery<
    ApiListResponse<FAQType[]>,
    ApiResponseError
  >({
    queryKey: ["faqs"],
    queryFn: async () => await getRequest("faqs/"),
  });

  const columns: ColumnDef<FAQType, FAQType[]>[] = [
    {
      accessorKey: "question",
      header: "Question",
      cell: ({ row }) => (
        <div className="max-w-md">
          <p className="font-medium text-sm">{row.getValue("question")}</p>
        </div>
      ),
    },
    {
      accessorKey: "answer",
      header: "Answer",
      cell: ({ row }) => (
        <div className="max-w-lg">
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
            {row.getValue("answer")}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.getValue("is_active")
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {row.getValue("is_active") ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(row.getValue("created_at")).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const faq = row.original;
        return (
          <div className="flex items-center gap-2">
            <EditFAQDialog faq={faq}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit className="h-4 w-4" />
              </Button>
            </EditFAQDialog>
            <ConfirmAlert
              title="Delete FAQ"
              text="Are you sure you want to delete this FAQ? This action cannot be undone."
              url={`faqs/${faq.id}/`}
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              }
              queryKey={["faqs"]}
            ></ConfirmAlert>
          </div>
        );
      },
    },
  ];

  const filteredData =
    data?.data?.results?.data?.filter((faq: FAQType) => {
      if (!query.query) return true;
      return query.fields.some((field) =>
        faq[field as keyof FAQType]
          ?.toString()
          .toLowerCase()
          .includes(query.query.toLowerCase())
      );
    }) || [];

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <MessageCircleQuestion className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                FAQs
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Manage frequently asked questions
              </p>
            </div>
          </div>
          <AddFAQDialog>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add FAQ
            </Button>
          </AddFAQDialog>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-700">
          <div className="p-6 py-4 border-b border-gray-300 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-md font-semibold text-gray-900 dark:text-gray-100">
                All FAQs
              </h2>
              <div className="">
                <TextSearch
                  placeholder="Search FAQs..."
                  value={query.query}
                  onChange={(e) =>
                    setQuery({ ...query, query: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="p-6">
            <DataTable
              columns={columns as any}
              data={filteredData}
              options={{
                isLoading,
              }}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default FAQ;
