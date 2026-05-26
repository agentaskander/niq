import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
const deployZone = import.meta.env.VITE_DEPLOY_ZONE;
const isPublicDeployment = deployZone === "public" || import.meta.env.VITE_PUBLIC_DEPLOYMENT === "true";
const isBetaDeployment = deployZone === "beta" || import.meta.env.VITE_BETA_DEPLOYMENT === "true";

if (isPublicDeployment) {
  import("./PublicDeploymentApp").then(({ PublicDeploymentApp }) => {
    root.render(
      <React.StrictMode>
        <PublicDeploymentApp />
      </React.StrictMode>
    );
  });
} else if (isBetaDeployment) {
  import("./BetaDeploymentApp").then(({ BetaDeploymentApp }) => {
    root.render(
      <React.StrictMode>
        <BetaDeploymentApp />
      </React.StrictMode>
    );
  });
} else {
  import("./InternalDeploymentApp").then(({ InternalDeploymentApp }) => {
    root.render(
      <React.StrictMode>
        <InternalDeploymentApp />
      </React.StrictMode>
    );
  });
}
