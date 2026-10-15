import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import Index from "./pages/index";
import { Provider } from "./components/provider";
import { AgentFeedback } from "@runablehq/website-runtime";

const Quest = lazy(() => import("./pages/quest"));

function App() {
  return (
    <Provider>
      <Switch>
        <Route path="/play">
          <Suspense
            fallback={
              <div className="quest-loading">
                <output>Loading Sunny Quest…</output>
              </div>
            }
          >
            <Quest />
          </Suspense>
        </Route>
        <Route component={Index} />
      </Switch>
      {/* Do not remove — off by default, activated by parent iframe via postMessage */}
      {import.meta.env.DEV && <AgentFeedback />}
    </Provider>
  );
}

export default App;
