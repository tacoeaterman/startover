import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGame } from "@/hooks/useGame";
import { Link } from "wouter";
import { Shield, Star } from "lucide-react";

export default function Store() {
  const { hasHostingPrivilege, purchaseHosting } = useGame();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Store</h1>
        <p className="text-white/70">Enhance your disc golf experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Hosting Privilege Product */}
        <Card className="glass-card rounded-3xl p-8 text-center border-0">
          <CardContent className="p-0">
            <div className="w-20 h-20 mx-auto mb-6 bg-brand-accent/20 rounded-3xl flex items-center justify-center">
              <Shield className="w-10 h-10 text-brand-accent" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Game Hosting Privilege</h3>
            <p className="text-white/70 mb-4">
              Unlock the ability to host games for up to 6 players with custom hole counts
            </p>
            <div className="text-3xl font-bold text-white mb-6">$9.99</div>
            <Button
              onClick={purchaseHosting}
              disabled={hasHostingPrivilege}
              className={`w-full font-semibold py-3 rounded-xl transition-colors ${
                hasHostingPrivilege
                  ? 'bg-green-500/20 text-green-300 cursor-not-allowed'
                  : 'bg-brand-accent text-white hover:bg-brand-accent/90'
              }`}
            >
              {hasHostingPrivilege ? 'Purchased ✅' : 'Purchase Now'}
            </Button>
            <div className="mt-4 text-sm text-white/60">One-time purchase • Lifetime access</div>
          </CardContent>
        </Card>

        {/* Premium Features Product */}
        <Card className="glass-card rounded-3xl p-8 text-center border-0">
          <CardContent className="p-0">
            <div className="w-20 h-20 mx-auto mb-6 bg-purple-500/20 rounded-3xl flex items-center justify-center">
              <Star className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Premium Features</h3>
            <p className="text-white/70 mb-4">
              Advanced statistics, custom scoring rules, and exclusive themes
            </p>
            <div className="text-3xl font-bold text-white mb-6">$4.99</div>
            <Button
              disabled
              className="w-full bg-purple-500/20 text-purple-300 font-semibold py-3 rounded-xl opacity-50 cursor-not-allowed"
            >
              Coming Soon
            </Button>
            <div className="mt-4 text-sm text-white/60">Monthly subscription</div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Link href="/">
          <Button className="bg-white/10 text-white px-8 py-3 rounded-xl hover:bg-white/20 transition-colors">
            Back to Main Menu
          </Button>
        </Link>
      </div>
    </div>
  );
}
