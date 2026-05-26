import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

if (import.meta.env.VITE_PUBLIC_DEPLOYMENT === "true") {
  import("./PublicDeploymentApp").then(({ PublicDeploymentApp }) => {
    root.render(
      <React.StrictMode>
        <PublicDeploymentApp />
      </React.StrictMode>
    );
  });
} else {
  import("./App").then(({ default: App }) => {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  });
}
