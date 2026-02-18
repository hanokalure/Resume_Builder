import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ResumeProvider } from "./context/ResumeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ResumeProvider>
      <App />
    </ResumeProvider>
  </StrictMode>
);
