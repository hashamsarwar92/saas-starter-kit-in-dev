"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Server,
  Globe,
  Database,
  Settings,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProfileCard from "@/lib/auth/components/ProfileCard";
import SignOutButton from "@/lib/auth/components/SignOutButton";
import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // const shouldRedirect = !loading && (!user || !user.isSubscribed);

  // useEffect(() => {
  //   if (shouldRedirect) {
  //     router.replace("/pricing");
  //   }
  // }, [shouldRedirect, router]);

  const navItems = [
    { name: "Overview", href: "/dashboard/", icon: LayoutDashboard },
    { name: "Hosting", href: "/dashboard/hosting", icon: Server },
    // { name: "Domain", href: "/dashboard/domain", icon: Globe },
    { name: "Database", href: "/dashboard/database", icon: Database },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const getInitials = (first?: string | null, last?: string | null) => {
    return `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase() || "U";
  };

  // if (loading) {
  //   return <Loading />;
  // }

  // if (shouldRedirect) {
  //   return <Loading />;
  // }

  return (
    
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r shadow-sm p-5 flex flex-col justify-between">
          {/* Top */}
          <div>
            <h1 className="text-2xl font-bold mb-8 text-gray-900">
              My Dashboard
            </h1>

            {/* User Info */}
            <ProfileCard/>
            <UserButton/>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;

                const isActive =
                  pathname === item.href ||
                  (pathname === "/dashboard" && item.href === "/dashboard/");

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
              {/* Bottom - Sign Out */}
              <SignOutButton/>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 min-h-full">
            {children}
          </div>
        </main>
      </div>
  );
}
