import { ArrowLeft, ArrowUpDown, Braces, Calculator, Calendar, CalendarOff, Code, Compass, Construction, Eraser, FileDiff, FileText, Globe, Home, Info, RefreshCcwDot, Rocket, Shield, Sparkles, Target, Unlock, Zap } from "lucide-react";

export const icons = {
  target: Target,
  rocket: Rocket,
  code: Code,
  zap: Zap,
  shield: Shield,
  'file-diff': FileDiff,
  calculator: Calculator,
  calendar: Calendar,
  info: Info,
  eraser: Eraser,
  unlock: Unlock,
  'arrow-up-down': ArrowUpDown,
  sparkles: Sparkles,
  compass: Compass,
  home: Home,
  'arrow-left': ArrowLeft,
  'refresh-ccw-dot': RefreshCcwDot,
  construction: Construction,
  braces: Braces,
  'calendar-off': CalendarOff,
  'file-text': FileText,
  globe: Globe
};

export function AppIcon({ name, className ='' }: { name: keyof typeof icons, className?: string }) {
  const Icon = icons[name];
  return <Icon className={className} />
}