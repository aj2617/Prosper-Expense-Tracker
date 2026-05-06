import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart3,
  ArrowRightLeft,
  Wallet,
  PiggyBank,
  PieChart,
  Repeat,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: BarChart3 },
  { title: "Transactions", url: "/transactions", icon: ArrowRightLeft },
  { title: "Repetitive", url: "/recurring", icon: Repeat },
  { title: "Budgets", url: "/budgets", icon: Wallet },
  { title: "Savings", url: "/savings", icon: PiggyBank },
  { title: "Reports", url: "/reports", icon: PieChart },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({
    select: (s) => s.location.pathname,
  });

  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="px-4 py-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground text-lg shadow-sm">
              P
            </div>
            {!collapsed && (
              <span className="text-xl font-extrabold tracking-tight text-foreground">
                PROSPER
              </span>
            )}
          </Link>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link
                      to={item.url}
                      className="flex items-center gap-2.5"
                    >
                      <item.icon className="h-[18px] w-[18px]" />
                      {!collapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className={`px-4 pb-4 ${collapsed ? "hidden" : ""}`}>
          <div className="rounded-2xl bg-accent/60 p-4">
            <p className="text-xs font-semibold text-accent-foreground">
              Demo Mode
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">
              Using sample data. Connect a backend to persist your finances.
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
