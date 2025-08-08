import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";

import AuthScreen from "@/pages/AuthScreen";
import MainMenu from "@/pages/MainMenu";
import Store from "@/pages/Store";
import HostGame from "@/pages/HostGame";
import JoinGame from "@/pages/JoinGame";
import GameLobby from "@/pages/GameLobby";
import GamePlay from "@/pages/GamePlay";
import GameResults from "@/pages/GameResults";
import AdminPanel from "@/pages/AdminPanel";
import NotFound from "@/pages/not-found";

function Router() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-gradient flex items-center justify-center">
        <div className="text-center text-white">
          <div className="floating-animation text-6xl mb-4">🥏</div>
          <h1 className="text-3xl font-bold mb-2">Kicked in the Disc</h1>
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <Switch>
      <Route path="/" component={MainMenu} />
      <Route path="/store" component={Store} />
      <Route path="/host" component={HostGame} />
      <Route path="/join" component={JoinGame} />
      <Route path="/lobby/:gameCode" component={GameLobby} />
      <Route path="/game/:gameCode" component={GamePlay} />
      <Route path="/results/:gameCode" component={GameResults} />
      <Route path="/admin" component={AdminPanel} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-brand-gradient">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
