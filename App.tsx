// App.tsx
import React from "react";
import { Route, Switch, Link } from "wouter";
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
          {/* Support both the generic results view and specific profile view */}
          <Route path="/results" component={ResultsPage} />
          <Route path="/results/:id" component={ResultsPage} />
          <Route path="/compare" component={ComparePage} />
          <Route path="/learn" component={LearnPage} />
          <Route>
            <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
              <div className="animate-in fade-in zoom-in duration-500">
                <h1 className="text-6xl font-serif mb-4 text-primary/20">404</h1>
                <p className="text-xl font-serif mb-2">Page Not Found</p>
                <p className="text-muted-foreground mb-8 italic">The map is not the territory.</p>
                <Link href="/">
                  <Button variant="outline" className="rounded-full cursor-pointer px-8">
                    Return to Laboratory
                  </Button>
                </Link>
              </div>
            </div>
          </Route>
        </Switch>
      </main>
    </div>
  );
}