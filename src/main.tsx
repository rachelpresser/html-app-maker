import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import posthog from "posthog-js";
import { getRouter } from "./router";
import "./styles.css";

posthog.init("phc_w4sCwvdVr3dHvKiiooGEh2eifJUgwQHBDQf5bfiG3H8V", {
  api_host: "https://app.posthog.com",
  autocapture: false,
  capture_pageview: false,
  persistence: "localStorage",
});

const router = getRouter();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
