import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createInstance, OptimizelyProvider } from "@optimizely/react-sdk";

const optimizely = createInstance({
  sdkKey: "Fj5krFFX4KsdkWq7JP8w5",
});

const urlParams = new URLSearchParams(window.location.search);

optimizely.onReady().then(() => {
  if (
    urlParams.has("optimizelyExperiment") &&
    urlParams.has("optimizelyVariation")
  ) {
    const experiment = urlParams.get("optimizelyExperiment")!;
    const variation = urlParams.get("optimizelyVariation")!;

    const foundExperiment = optimizely.setForcedVariation(
      experiment,
      "1",
      variation
    );

    if (!foundExperiment) {
      console.warn(
        `Unable to find either Optimizely experiment [${experiment}] or variation [${variation}]`
      );
    }
  }
});

ReactDOM.render(
  <React.StrictMode>
    <OptimizelyProvider
      optimizely={optimizely}
      user={{
        id: "1",
      }}
      timeout={500}
    >
      <App />
    </OptimizelyProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
