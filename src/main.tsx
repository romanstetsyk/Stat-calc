import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { App } from "./App.tsx";
import "./index.css";
import { SessionProvider } from "./contexts/SessionContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <SessionProvider>
        <App />
      </SessionProvider>
    </ChakraProvider>
  </React.StrictMode>
);
