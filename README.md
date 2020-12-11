# optimizely-sdk-rerender-behaviour

## Running the project

- Clone this repository.
- Run `npm install` or `yarn install`.
- Run `npm start` or `yarn start`.

## Problem overview

This repository reproduces some undesirable behaviour caused in situations where we want to force Optimizely experiment variations during local development.

The following is an outline of how we want to be able to force variations:

- Develop components as per usual without needing to add any special code in the components to handle the forcing of variations.
- Default behaviour is to use Optimizely's default behaviour for bucketing a user.
- If we want to force a variation, provide two URL parameters (`optimizelyExperiment` and `optimizelyVariation`) to specify the experiment/variation combination to render.

In `src/index.tsx` you can see the logic for implementing the above behaviour. We hook into the SDK client's `onReady` lifecycle and execute code to check for the presence of `optimizelyExperiment` and `optimizelyVariation` in the URL - if they are, we call `setForcedVariation` to force that variation.

**The problem**: When `setForcedVariation` is called, the screen is not rerendered, so the user doesn't actually see that variation.

## How to reproduce the problem

The goal is to toggle the user's experiment status between the boring button (`show_boring_button`) and the shiny button (`show_shiny_button`). The user is bucketed to see the boring button by default.

1. Run the project and navigate to `localhost:3000`.
2. Observe that the user sees the boring button.
3. Navigate to `localhost:3000/?optimizelyExperiment=test_experiment&optimizelyVariation=show_shiny_button`.
4. Observe that the user still sees the boring button.

When diving into Optimizely's debug logs, you can see that the user has indeed been forced into the `show_shiny_button` variation but they are seeing the boring button on the screen.

## Where things get weird

So far we've seen that there isn't the expected rerender behaviour when trying to force variations via the URL, however we can get this behaviour to semi-work if we do the following:

1. Run the project and navigate to `localhost:3000/?optimizelyExperiment=test_experiment&optimizelyVariation=show_shiny_button`.
2. Observe that the user sees the boring button.
3. Uncomment line 13 in `src/App.tsx` and save the file.
4. Go back to your browser (Note: our last navigation was `localhost:3000/?optimizelyExperiment=test_experiment&optimizelyVariation=show_shiny_button`).
5. Observe that the shiny button is displayed.

This is incredibly weird and may have you thinking "well, just use the hook then". However...

1. Reload the browser.
2. Notice that the boring button is now displayed despite the URL being `localhost:3000/?optimizelyExperiment=test_experiment&optimizelyVariation=show_shiny_button`.

At this point we're already in a weird state... but wait, it gets weirder!

1. Comment line 13 in `src/App.tsx` and save the file.
2. Notice that the shiny button is being displayed!

How is this one possible? This is now back to our original code and the shiny button is being shown. To finish it all off...

1. Reload the browser.
2. Notice that the boring button is now displayed despite the URL being `localhost:3000/?optimizelyExperiment=test_experiment&optimizelyVariation=show_shiny_button`.

## Concluding thoughts

This seems like a bug where rerender isn't being triggered when it should be. We would like this to be fixed so that it's possible for us to deterministically toggle the state of our experiments. The benefits of this are:

- It allows us to run integration tests on code behind an experiment.
- It allows developers to easily toggle between experiment states when developing features locally.
