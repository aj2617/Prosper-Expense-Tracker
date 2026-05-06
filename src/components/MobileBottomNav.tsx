import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  ArrowRightLeft,
  Wallet,
  PiggyBank,
  PieChart,
  Repeat,
} from "lucide-react";

const navItems = [
  { title: "Home", url: "/", icon: BarChart3 },
  { title: "Budgets", url: "/budgets", icon: Wallet },
  { title: "Transactions", url: "/transactions", icon: ArrowRightLeft },
  { title: "Savings", url: "/savings", icon: PiggyBank },
  { title: "Reports", url: "/reports", icon: PieChart },
];

export function MobileBottomNav() {
  const currentPath = useRouterState({
    select: (s) => s.location.pathname,
  });

  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 glass md:hidden safe-bottom">
      <div className="flex items-stretch justify-around">
        {navItems.map((item) => {
          const active = isActive(item.url);
          return (
            <Link
              key={item.url}
              to={item.url}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                active
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className={`h-5 w-5 ${active ? "text-primary" : ""}`} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
