import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "../src/main.css";
import { AuthProvider, useAuth } from "./context/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { SocketProvider } from "./context/socket";
import { ThemeProvider } from "./context/theme-provider";
import { NotificationProvider } from "./context/notification";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});
// Set up a Router instance
const router = createRouter({
  context: {
    auth: undefined!, // This will be set after we wrap the app in an AuthProvider
    queryClient,
  },
  routeTree,
  defaultPreload: "intent",
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function InnerApp() {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <Toaster richColors position="top-center" />
              <InnerApp />
            </ThemeProvider>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
