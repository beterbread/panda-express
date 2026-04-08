import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { TranslationProvider } from "./components/Translation/TranslationWrapper";
import routes from "./routes";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TranslationProvider>
      <RouterProvider router={routes} />
    </TranslationProvider>
  </StrictMode>,
);
