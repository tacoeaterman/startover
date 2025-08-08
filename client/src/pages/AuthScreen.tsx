import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      await signIn(email, password);
    } else {
      if (password !== confirmPassword) {
        return;
      }
      await signUp(email, password, displayName);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card className="glass-card rounded-3xl p-8 text-center border-0">
        <CardContent className="p-0">
          <div className="text-6xl mb-6 floating-animation">🥏</div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-white/80 mb-8">
            {isLogin ? 'Sign in to track your disc golf games' : 'Join the disc golf community'}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-left">
              <Label className="block text-white/80 text-sm font-medium mb-2">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:border-white/40"
                placeholder="Enter your email"
                required
              />
            </div>
            
            {!isLogin && (
              <div className="text-left">
                <Label className="block text-white/80 text-sm font-medium mb-2">Display Name</Label>
                <Input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:border-white/40"
                  placeholder="Choose a display name"
                  required
                />
              </div>
            )}
            
            <div className="text-left">
              <Label className="block text-white/80 text-sm font-medium mb-2">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:border-white/40"
                placeholder={isLogin ? "Enter your password" : "Minimum 6 characters"}
                required
                minLength={6}
              />
            </div>
            
            {!isLogin && (
              <div className="text-left">
                <Label className="block text-white/80 text-sm font-medium mb-2">Confirm Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:border-white/40"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}
            
            <Button 
              type="submit"
              className="w-full bg-white text-brand-primary font-semibold py-3 rounded-xl hover:bg-white/90 transition-colors"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
            
            <Button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full bg-transparent border border-white/30 text-white font-semibold py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              {isLogin ? 'Create Account' : 'Back to Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
