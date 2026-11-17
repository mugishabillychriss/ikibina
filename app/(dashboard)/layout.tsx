import { AppSidebar } from '@/components/app-shell/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div><AppSidebar /><div style={{marginLeft:248,minHeight:'100vh'}}><header style={{height:72,background:'#fff',borderBottom:'1px solid #e3eaf1',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 30px',position:'sticky',top:0,zIndex:10}}><strong>Ikibina Savings Group</strong><div style={{display:'flex',alignItems:'center',gap:12,fontSize:12}}><span style={{color:'#718096'}}>Africa/Kigali</span><div style={{width:34,height:34,borderRadius:'50%',background:'#e9f0f7',display:'grid',placeItems:'center',fontWeight:800}}>L</div></div></header><main style={{padding:'28px 30px 48px'}}>{children}</main></div></div>;
}
