/**
 * @file main.tsx
 * @description Application entry point. Mounts the root React component
 *              into the DOM element with id "root" (defined in index.html).
 *
 * @project  CheeseHacks 2026 — Remote Surgery Interface
 * @version  0.0.1
 * @since    2026-02-28
 */

import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(<App />);