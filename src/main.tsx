import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// Hide preloader once React has mounted
const preloader = document.getElementById("preload");
if (preloader) {
  requestAnimationFrame(() => {
    preloader.classList.add("fade-out");
    setTimeout(() => preloader.remove(), 700);
  });
}
