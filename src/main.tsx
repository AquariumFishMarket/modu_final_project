import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./assets/styles/reset.css";
import "./index.css";
import { runFishEasterEgg } from "./utils/fishEasterEgg";

runFishEasterEgg({
  initialDelay: 1500, 
  interval: 400, 
  colorize: true, 
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
