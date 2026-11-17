'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, WalletCards, ShieldAlert, HandCoins, ReceiptText, ArrowLeftRight, FileBarChart, ScrollText, Settings, LogOut, CircleDollarSign } from 'lucide-react';

const navigation = [
  ['Dashboard', '/dashboard', LayoutDashboard],
  ['Members', '/members', Users],
  ['Contributions', '/contributions', WalletCards],
  ['Penalties', '/penalties', ShieldAlert],
  ['Loans', '/loans', HandCoins],
  ['Loan Repayments', '/loan-repayments', ArrowLeftRight],
  ['Expenses', '/expenses', ReceiptText],
  ['Transactions', '/transactions', CircleDollarSign],
  ['Financial Reports', '/reports', FileBarChart],
  ['Audit Logs', '/audit', ScrollText],
  ['Settings', '/settings', Settings],
] as const;

export function AppSidebar({ open = false }: { open?: boolean }) {
  const pathname = usePathname();
  return (
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-mark">I</div>
        <div className="sidebar-name"><strong>IKIBINA</strong><span>SAVINGS GROUP</span></div>
      </div>
      <div className="sidebar-label">WORKSPACE</div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navigation.map(([label, href, Icon]) => (
          <Link key={href} href={href} className={`sidebar-link ${pathname.startsWith(href) ? 'active' : ''}`}>
            <Icon size={16} strokeWidth={1.8} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="sidebar-footer">
        <Link href="/login" className="sidebar-link"><LogOut size={16} strokeWidth={1.8}/><span>Logout</span></Link>
        <div className="sidebar-user"><div className="sidebar-avatar">L</div><div><div className="sidebar-user-name">Group Leader</div><div className="sidebar-user-role">Administrator</div></div></div>
      </div>
    </aside>
  );
}
