import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { LayoutDashboard, Video, User, Menu } from "lucide-react";

export function Sidebar() {
  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/meetings", label: "Meetings", icon: Video },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 h-full bg-black/10 backdrop-blur-xl border-r border-white/10">
      <div className="flex flex-col h-full w-full p-4">
        <div className="flex items-center gap-2 p-2">
          <div className="bg-orange-500 w-8 h-8 rounded-lg" />
          <span className="font-semibold text-white">COM | PSU Rizal</span>
        </div>
        
        <nav className="flex flex-col gap-2 mt-8 flex-1">
          {links.map((link) => (
            <Link 
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export function MobileSidebar() {
  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/meetings", label: "Meetings", icon: Video },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 bg-black/80 backdrop-blur-xl border-r border-white/10 p-0">
        <div className="flex flex-col h-full w-full p-4">
          <div className="flex items-center gap-2 p-2">
            <div className="bg-orange-500 w-8 h-8 rounded-lg" />
            <span className="font-semibold text-white">COM | PSU Rizal</span>
          </div>
          
          <nav className="flex flex-col gap-2 mt-8 flex-1">
            {links.map((link) => (
              <Link 
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}