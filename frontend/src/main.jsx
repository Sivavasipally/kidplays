import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { applyTheme, getInitialTheme } from "./theme.js";
import "./styles/index.css";

// Apply the saved Day/Night theme before first paint (no flash).
applyTheme(getInitialTheme());

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
