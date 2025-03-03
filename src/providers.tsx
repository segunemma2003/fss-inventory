import { Suspense } from "react";
import { routes } from "@/routes";
import * as Sentry from "@sentry/react";
import Loading from "@/components/ui/Spinner";
import { Toaster } from "./components/ui/toaster";
import { getProvider } from "./hooks/useProviders";
import { ErrorFallback } from "./components/layouts/Error";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

const RenderLoader = () => {
  return (
    <div className="flex flex-auto items-center justify-center flex-col min-h-[100vh]">
      <Loading />
    </div>
  );
};

const router = createBrowserRouter(createRoutesFromElements(routes));
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

export const RouterProviderObject = getProvider({
  provider: RouterProvider,
  props: {
    router,
    future: { v7_relativeSplatPath: true },
  },
});

export const QueryClientProvider = getProvider({
  provider: PersistQueryClientProvider,
  props: {
    client: new QueryClient(),
    persistOptions: { persister },
  },
  children: [RouterProviderObject],
});

export const SuspenseFallback = getProvider({
  provider: Suspense,
  props: {
    fallback: <RenderLoader />,
  },
  children: [QueryClientProvider],
});

export const ToasterProvider = getProvider({
  provider: Toaster,
  props: {},
});

export const SentryErrorBoundary = getProvider({
  provider: Sentry.ErrorBoundary,
  props: {
    fallback: ErrorFallback,
  },
  children: [SuspenseFallback, ToasterProvider],
});
