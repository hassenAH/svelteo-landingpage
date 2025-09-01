import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { MotionConfig } from "framer-motion";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </React.StrictMode>
);
