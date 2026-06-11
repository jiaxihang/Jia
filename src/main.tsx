import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { EffectsProvider } from "@/contexts/EffectsContext";
import { AppRoutes } from "@/routes";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <EffectsProvider>
          <MotionConfig reducedMotion="user">
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </MotionConfig>
        </EffectsProvider>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>
);
