'use client';

import { useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import { AppSidebar } from '@/components/app-shell/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const date = new Intl.DateTimeFormat('en-GB', { timeZone: 'Africa/Kigali', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  return (
    <div className="app-shell">
      <AppSidebar open={open} />
      <div className={`mobile-scrim ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
      <div className="app-main">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu" aria-label="Open menu" onClick={() => setOpen(true)}><Menu size={18}/></button>
            <div><div className="topbar-title">Ikibina Savings Group</div><div className="topbar-date">{date}</div></div>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" aria-label="Notifications"><Bell size={16}/></button>
            <div className="profile-pill"><div className="profile-avatar">L</div><div className="profile-copy"><div className="profile-name">Group Leader</div><div className="profile-role">Administrator</div></div></div>
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
