import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GameCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function GameCard({ title, description, icon, onClick, disabled, className }: GameCardProps) {
  return (
    <Card 
      className={cn(
        "glass-card rounded-2xl p-6 card-hover cursor-pointer transition-all duration-200",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={disabled ? undefined : onClick}
    >
      <CardContent className="p-0 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-white font-semibold mb-2">{title}</h3>
        <p className="text-white/70 text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}
