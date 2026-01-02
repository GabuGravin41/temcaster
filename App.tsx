
// App.tsx
import React from "https://esm.sh/react@19";
import { Route, Switch } from "https://esm.sh/wouter@3.9.0";
import Header from "./components/Header.tsx";
import HomePage from "./pages/HomePage.tsx";
import TestPage from "./pages/TestPage.tsx";
import ResultsPage from "./pages/ResultsPage.tsx";
import ComparePage from "./pages/ComparePage.tsx";
import LearnPage from "./pages/LearnPage.tsx";
import { Button } from "./components/ui/button.tsx";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/test" component={TestPage} />
          <Route path="/results" component={ResultsPage} />
          <Route path="/compare" component={ComparePage} />
          <Route path="/learn" component={LearnPage} />
          <Route>
            <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
              <div>
                <h1 className="text-4xl font-serif mb-4">404</h1>
                <p className="text-muted-foreground mb-8 italic">The map is not the territory.</p>
                <Button variant="outline" className="rounded-full cursor-pointer">
                  Return Home
                </Button>
              </div>
            </div>
          </Route>
        </Switch>
      </main>
    </div>
  );
}
