import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GameCard } from "@/components/GameCard";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/hooks/useGame";
import { Link } from "wouter";
import { Plus, Users, ShoppingBag, BarChart3, Settings } from "lucide-react";

export default function MainMenu() {
  const { user, logout } = useAuth();
  const { hasHostingPrivilege } = useGame();

  return (
    <>
      {/* Navigation Header */}
      <nav className="glass-card p-4 m-4 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🥏</div>
            <h1 className="text-xl font-bold text-white">Kicked in the Disc</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-white/80 text-sm">{user?.displayName || user?.email}</span>
            <Link href="/admin">
              <Button
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                size="sm"
                title="Admin Panel"
              >
                <Settings className="w-5 h-5 text-white" />
              </Button>
            </Link>
            <Button
              onClick={logout}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              size="sm"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1"></path>
              </svg>
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* User Status Card */}
        <Card className="glass-card rounded-3xl p-6 mb-8 border-0">
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  Welcome, {user?.displayName?.split(' ')[0] || 'Player'}!
                </h2>
                <p className="text-white/70">Ready to play some disc golf?</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-white/70 text-sm">Hosting Privilege:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    hasHostingPrivilege 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {hasHostingPrivilege ? '✅ Purchased' : '❌ Not Purchased'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <Link href="/host">
            <GameCard
              title="Host Game"
              description="Create a new game for up to 6 players"
              disabled={!hasHostingPrivilege}
              icon={<Plus className="w-8 h-8 text-brand-accent" />}
              className={!hasHostingPrivilege ? "opacity-50" : ""}
            />
          </Link>

          <Link href="/join">
            <GameCard
              title="Join Game"
              description="Enter a game code to join an existing game"
              icon={<Users className="w-8 h-8 text-blue-400" />}
            />
          </Link>

          <Link href="/store">
            <GameCard
              title="Store"
              description="Purchase hosting privileges and upgrades"
              icon={<ShoppingBag className="w-8 h-8 text-purple-400" />}
            />
          </Link>

          <GameCard
            title="Statistics"
            description="View your game history and performance"
            icon={<BarChart3 className="w-8 h-8 text-green-400" />}
          />
        </div>

        {/* Recent Games */}
        <Card className="glass-card rounded-3xl p-6 border-0">
          <CardContent className="p-0">
            <h3 className="text-xl font-bold text-white mb-4">Recent Games</h3>
            <div className="text-center py-8">
              <p className="text-white/70">No recent games found</p>
              <p className="text-white/50 text-sm mt-2">Join or host a game to get started!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
