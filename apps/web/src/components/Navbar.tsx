'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useAuth } from '../lib/auth-context';
import { Film, LayoutDashboard, ListVideo, PlusCircle, LogOut, Menu, X, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If user is on login or register, don't show full dashboard navbar
  if (!user && (pathname === '/login' || pathname === '/register')) {
    return (
      <header className="w-full bg-[#FEFFE0] border-b-3 border-[#241B21] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <a href="/login" className="flex items-center gap-2 group">
            <div className="p-2 bg-[#B5185F] text-[#FEFFE0] rounded-xl border-2 border-[#241B21] shadow-retro-sm group-hover:rotate-6 transition-transform">
              <Film className="w-6 h-6" />
            </div>
            <span className="font-black text-2xl sm:text-3xl tracking-tight text-[#241B21]">
              REEL<span className="text-[#B5185F]">IO</span>
            </span>
          </a>
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-wider px-3 py-1 bg-[#D0E86E] border-2 border-[#241B21] rounded-full text-[#241B21] hidden sm:inline-block">
            Personal Cinema Watchlist
          </span>
        </div>
      </header>
    );
  }

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Watchlist', href: '/watchlist', icon: ListVideo },
  ];

  return (
    <header className="w-full bg-[#FEFFE0] border-b-3 border-[#241B21] sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <a href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="p-2 bg-[#B5185F] text-[#FEFFE0] rounded-xl border-2 border-[#241B21] shadow-retro-sm group-hover:-rotate-6 transition-transform">
            <Film className="w-6 h-6" />
          </div>
          <span className="font-black text-2xl sm:text-3xl tracking-tight text-[#241B21]">
            REEL<span className="text-[#B5185F]">IO</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 font-bold text-sm rounded-xl border-2 transition-all ${
                  isActive
                    ? 'bg-[#35C1C2] text-[#241B21] border-[#241B21] shadow-retro-sm'
                    : 'border-transparent text-[#241B21] hover:bg-[#E7DDE2] hover:border-[#241B21]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/watchlist/tambah"
            className="flex items-center gap-2 px-4 py-2 font-extrabold text-sm text-[#FEFFE0] bg-[#B5185F] border-2 border-[#241B21] rounded-xl shadow-retro-sm hover:bg-[#93124C] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            Tambah Tontonan
          </a>

          {user && (
            <div className="flex items-center gap-2 pl-2 border-l-2 border-[#241B21]">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#E7DDE2] border-2 border-[#241B21] rounded-xl">
                <UserIcon className="w-4 h-4 text-[#B5185F]" />
                <span className="font-bold text-xs text-[#241B21] max-w-[120px] truncate">
                  {user.name}
                </span>
              </div>
              <button
                type="button"
                onClick={logout}
                title="Keluar dari akun"
                className="p-2 text-[#241B21] bg-white border-2 border-[#241B21] rounded-xl hover:bg-[#B5185F] hover:text-[#FEFFE0] transition-colors shadow-retro-sm"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <a
            href="/watchlist/tambah"
            className="p-2 text-[#FEFFE0] bg-[#B5185F] border-2 border-[#241B21] rounded-xl shadow-retro-sm"
            title="Tambah Tontonan"
          >
            <PlusCircle className="w-5 h-5" />
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-white border-2 border-[#241B21] rounded-xl text-[#241B21] shadow-retro-sm"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-[#241B21] bg-[#FEFFE0] px-4 py-4 space-y-3">
          {user && (
            <div className="p-3 bg-[#E7DDE2] border-2 border-[#241B21] rounded-xl flex items-center gap-3">
              <div className="p-2 bg-[#B5185F] text-[#FEFFE0] rounded-lg">
                <UserIcon className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-sm text-[#241B21] truncate">{user.name}</p>
                <p className="text-xs text-[#62535E] truncate">{user.email}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 font-bold text-sm rounded-xl border-2 ${
                    isActive
                      ? 'bg-[#35C1C2] text-[#241B21] border-[#241B21] shadow-retro-sm'
                      : 'bg-white border-[#241B21] text-[#241B21]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </a>
              );
            })}

            <a
              href="/watchlist/tambah"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 font-extrabold text-sm text-[#FEFFE0] bg-[#B5185F] border-2 border-[#241B21] rounded-xl shadow-retro-sm"
            >
              <PlusCircle className="w-4 h-4" />
              + Tambah Tontonan
            </a>

            {user && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 font-bold text-sm text-[#B5185F] bg-white border-2 border-[#241B21] rounded-xl hover:bg-[#E7DDE2]"
              >
                <LogOut className="w-4 h-4" />
                Keluar dari Akun
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
