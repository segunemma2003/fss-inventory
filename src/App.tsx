import { useProviders } from "./hooks/useProviders";
import { SentryErrorBoundary } from "./providers";

function App() {
  return useProviders(SentryErrorBoundary);
}

export default App;
