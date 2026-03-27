import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import AppRoutes from "./routes";
import { Toaster } from "react-hot-toast";

const TokenInjector = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const interval = setInterval(async () => {
      const token = await getToken();
      window.__nexus_token = token;
    }, 1000 * 60); // refresh every 60s

    getToken().then((t) => {
      window.__nexus_token = t;
    });

    return () => clearInterval(interval);
  }, [getToken]);

  return null;
};

const App = () => (
  <>
    <TokenInjector />
    <AppRoutes />
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#1a1a1a",
          color: "#f0f0f0",
          border: "1px solid rgba(255,255,255,0.1)",
          fontSize: "14px",
        },
      }}
    />
  </>
);

export default App;
