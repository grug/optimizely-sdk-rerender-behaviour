import React, { useContext } from "react";
import "./App.css";
import {
  OptimizelyContext,
  OptimizelyExperiment,
  OptimizelyVariation,
  useExperiment,
} from "@optimizely/react-sdk";

function App() {
  const { optimizely } = useContext(OptimizelyContext);

  // const [variation, isReady] = useExperiment("test_experiment");

  const buttonClicked = () => optimizely?.track("button clicked");

  return (
    <div className="App">
      <h1>Here are some things</h1>
      <ul>
        <li>Pizza</li>
        <li>Cats</li>
        <li>Cheese</li>
        <OptimizelyExperiment experiment="test_experiment">
          <OptimizelyVariation variation="show_boring_button">
            <li>
              <button onClick={buttonClicked}>Click me</button>
            </li>
          </OptimizelyVariation>
          <OptimizelyVariation variation="show_shiny_button">
            <li>
              <button className="shiny-button" onClick={buttonClicked}>
                Click me
              </button>
            </li>
          </OptimizelyVariation>
        </OptimizelyExperiment>
      </ul>
    </div>
  );
}

export default App;
