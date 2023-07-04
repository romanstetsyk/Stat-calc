import "./index.css";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { App } from "~/App.tsx";
import { DataColumnsProvider } from "~/contexts/DataColumnsContext.tsx";
import { SessionProvider } from "~/contexts/SessionContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <DataColumnsProvider>
          <SessionProvider>
            <App />
          </SessionProvider>
        </DataColumnsProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
