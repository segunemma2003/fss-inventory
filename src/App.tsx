import { useProviders } from "./hooks/useProviders";
import { SentryErrorBoundary } from "./providers";


function App() {
  // const queryClient = new QueryClient();

  // const router = createBrowserRouter(createRoutesFromElements(routes));

  // const providers: Providers = {
  //   types: Sentry.ErrorBoundary,
  //   props: { fallback: ErrorFallback },
  //   children: [
  //     {
  //       types: Suspense,
  //       props: {
  //         fallback: (
  //           <div className="flex flex-auto items-center justify-center flex-col min-h-[100vh]">
  //             <Loading />
  //           </div>
  //         ),
  //       },
  //       children: [
  //         {
  //           types: QueryClientProvider,
  //           props: { client: queryClient },
  //           children: [
  //             {
  //               types: RouterProvider,
  //               props: { router, future: { v7_relativeSplatPath: true } },
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       types: Toaster,
  //       props: {},
  //     },
  //   ],
  // };

  return useProviders(SentryErrorBoundary);
}

export default App;
