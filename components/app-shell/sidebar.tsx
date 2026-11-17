'use client';

import { LayoutDashboard, Users, WalletCards, ShieldAlert, HandCoins, ReceiptText, ArrowLeftRight, FileBarChart, ScrollText, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  ['Dashboard', '/dashboard', LayoutDashboard], ['Members', '/members', Users], ['Contributions', '/contributions', WalletCards],
  ['Penalties', '/penalties', ShieldAlert], ['Loans', '/loans', HandCoins], ['Loan Repayments', '/loan-repayments', ArrowLeftRight],
  ['Expenses', '/expenses', ReceiptText], ['Transactions', '/transactions', ArrowLeftRight], ['Financial Reports', '/reports', FileBarChart],
  ['Audit Logs', '/audit', ScrollText], ['Settings', '/settings', Settings]
] as const;

export function AppSidebar() {
  const pathname = usePathname();
  return <aside style={{position:'fixed',inset:'0 auto 0 0',width:248,background:'#102b46',color:'#dce8f2',padding:'24px 14px',display:'flex',flexDirection:'column',zIndex:20}}>
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'0 10px 26px'}}><div style={{width:40,height:40,borderRadius:11,background:'#d0a64d',color:'#102b46',display:'grid',placeItems:'center',fontWeight:900}}>I</div><div><strong style={{letterSpacing:'0.11em'}}>IKIBINA</strong><div style={{fontSize:10,color:'#96aec2',letterSpacing:'0.09em'}}>MANAGEMENT SYSTEM</div></div></div>
    <nav style={{display:'grid',gap:3}}>{navigation.map(([label, href, Icon]) => <Link key={href} href={href} style={{display:'flex',alignItems:'center',gap:11,padding:'10px 12px',borderRadius:8,color:pathname.startsWith(href)?'#fff':'#c1d0dd',background:pathname.startsWith(href)?'#183d5f':'transparent',textDecoration:'none',fontSize:13,fontWeight:650}}><Icon size={17}/>{label}</Link>)}</nav>
    <Link href="/login" style={{marginTop:'auto',display:'flex',alignItems:'center',gap:11,padding:'12px',color:'#c1d0dd',textDecoration:'none',fontSize:13}}><LogOut size={17}/>Logout</Link>
  </aside>;
}
