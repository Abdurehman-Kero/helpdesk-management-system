"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SessionPayload } from "@/lib/auth";
import { logoutUser } from "@/actions/auth.actions";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Ticket, LayoutDashboard, PlusCircle, LogOut, Menu, X } from "lucide-react";

interface NavbarProps {
  session: SessionPayload | null;
}

export function Navbar({ session }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!session) return null;

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/tickets", label: "Tickets", icon: Ticket },
  ];

  if (session.role === "EMPLOYEE") {
    navLinks.push({ href: "/tickets/new", label: "New Ticket", icon: PlusCircle });
  }

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Desktop Navigation */}
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 font-semibold text-slate-900 text-sm tracking-tight"
            >
              <div className="w-7 h-7 bg-slate-900 text-white rounded flex items-center justify-center font-bold text-xs">
                HD
              </div>
              <span>Helpdesk</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/dashboard" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Desktop User Context & Logout */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-medium text-slate-900">{session.name}</span>
              <Badge type="role" value={session.role} />
            </div>

            <form action={logoutUser}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="gap-1.5 text-xs text-slate-500 hover:text-red-600"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </Button>
            </form>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100">
              <div>
                <p className="text-xs font-semibold text-slate-900">{session.name}</p>
                <p className="text-[11px] text-slate-500">{session.email}</p>
              </div>
              <Badge type="role" value={session.role} />
            </div>

            <nav className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/dashboard" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="pt-2 border-t border-slate-100 px-1">
              <form action={logoutUser}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out ({session.name})</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
