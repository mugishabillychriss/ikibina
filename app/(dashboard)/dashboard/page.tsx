export const revalidate = 30;

async function getDashboardData() {
  return { members: 0, active: 0, inactive: 0, contributions: 0, outstanding: 0, penalties: 0, loans: 0, expenses: 0, cash: 0 };
}

function Metric({ label, value, note, accent = '#316fa7' }: { label: string; value: string; note: string; accent?: string }) {
  return <article style={{background:'#fff',border:'1px solid #e3eaf1',borderRadius:14,padding:18,minHeight:126}}><div style={{display:'flex',justifyContent:'space-between',color:'#718096',fontSize:12,fontWeight:700}}><span>{label}</span><span style={{width:30,height:30,borderRadius:9,background:'#edf4fb',color:accent,display:'grid',placeItems:'center'}}>◆</span></div><div style={{fontSize:27,fontWeight:800,letterSpacing:'-0.04em',margin:'12px 0 4px'}}>{value}</div><div style={{fontSize:11,color:'#718096'}}>{note}</div></article>;
}

export default async function DashboardPage() {
  const d = await getDashboardData();
  const rwf = (v: number) => `RWF ${v.toLocaleString('en-RW')}`;
  return <><div style={{display:'flex',justifyContent:'space-between',alignItems:'end',marginBottom:18}}><div><h1 style={{margin:0,fontSize:21}}>Financial overview</h1><p style={{margin:'5px 0 0',color:'#718096',fontSize:12}}>Live records from Supabase</p></div><button style={{border:'1px solid #dfe7ef',borderRadius:8,padding:'9px 12px',background:'#fff',fontWeight:700}}>Export report</button></div>
  <div style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:14}}>
    <Metric label="Registered members" value={String(d.members)} note={`${d.active} active · ${d.inactive} inactive`} /><Metric label="Contributions collected" value={rwf(d.contributions)} note="Paid obligations" accent="#1d8f62"/><Metric label="Outstanding obligations" value={rwf(d.outstanding)} note="Unpaid contribution balances" accent="#b0770e"/><Metric label="Available cash" value={rwf(d.cash)} note="Calculated ledger balance" accent="#1d8f62"/><Metric label="Penalties assessed" value={rwf(d.penalties)} note="Assessed, not necessarily collected" accent="#c94949"/><Metric label="Loans issued" value={rwf(d.loans)} note="Disbursement principal" accent="#316fa7"/><Metric label="Group expenses" value={rwf(d.expenses)} note="Approved operational spending" accent="#c94949"/><Metric label="Monthly status" value="Ready" note="Configure Supabase tables and policies" accent="#b0770e"/>
  </div><section style={{display:'grid',gridTemplateColumns:'1.5fr 1fr',gap:14,marginTop:14}}><article style={{background:'#fff',border:'1px solid #e3eaf1',borderRadius:14,padding:18}}><h3 style={{margin:'0 0 8px',fontSize:14}}>Financial activity</h3><div style={{height:220,display:'grid',placeItems:'center',color:'#718096',border:'1px dashed #dde6ee',borderRadius:10}}>Connect database queries to enable live charts</div></article><article style={{background:'#fff',border:'1px solid #e3eaf1',borderRadius:14,padding:18}}><h3 style={{margin:'0 0 8px',fontSize:14}}>Recent activity</h3><p style={{color:'#718096',fontSize:12}}>No live activity loaded. Supabase records will appear here after schema setup.</p></article></section></>;
}
