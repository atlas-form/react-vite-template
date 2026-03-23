import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import "./index.css";
import "./i18n";
import App from "./App";
import { initTheme } from "@/theme";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root not found");
initTheme();

createRoot(rootElement).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
