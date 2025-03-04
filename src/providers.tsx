import { Suspense } from "react";
import { AppRoutes } from "@/routes";
import * as Sentry from "@sentry/react";
import Loading from "@/components/ui/Spinner";
import { Toaster } from "./components/ui/toaster";
import { getProvider } from "./hooks/useProviders";
import { QueryClient } from "@tanstack/react-query";
import { ErrorFallback } from "./components/layouts/Error";
import { BrowserRouter } from "react-router";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

const RenderLoader = () => {
  return (
    <div className="flex flex-auto items-center justify-center flex-col min-h-[100vh]">
      <Loading />
    </div>
  );
};

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

export const RouterProviderObject = getProvider({
  provider: BrowserRouter,
  props: { children: <AppRoutes /> },
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
});

export const SentryErrorBoundary = getProvider({
  provider: Sentry.ErrorBoundary,
  props: {
    fallback: ErrorFallback,
  },
  children: [SuspenseFallback, ToasterProvider],
});
