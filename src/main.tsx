import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { App } from "./App.tsx";
import "./index.css";
import { SessionProvider } from "./contexts/SessionContext.tsx";
import { DataColumnsProvider } from "./contexts/DataColumnsContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <DataColumnsProvider>
        <SessionProvider>
          <App />
        </SessionProvider>
      </DataColumnsProvider>
    </ChakraProvider>
  </React.StrictMode>
);
