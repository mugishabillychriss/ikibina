import { Download, Users, WalletCards, AlertTriangle, HandCoins, ReceiptText, CircleDollarSign } from 'lucide-react';

export const revalidate = 30;

async function getDashboardData() {
  return { members: 0, active: 0, inactive: 0, contributions: 0, outstanding: 0, penaltiesCollected: 0, penaltiesAssessed: 0, loans: 0, loanRepayments: 0, expenses: 0, cash: 0 };
}

function Metric({ label, value, note, icon: Icon, tone = 'blue' }: { label: string; value: string; note: string; icon: typeof Users; tone?: 'blue'|'green'|'amber'|'red' }) {
  const colors = { blue:'#2f70a8', green:'#16885b', amber:'#bc7b16', red:'#c84c4c' };
  return (
    <article className="metric-card">
      <div className="metric-top"><span>{label}</span><span className="metric-icon" style={{color:colors[tone]}}><Icon size={15} strokeWidth={1.8}/></span></div>
      <div className="metric-value">{value}</div><div className="metric-note">{note}</div>
    </article>
  );
}

export default async function DashboardPage() {
  const d = await getDashboardData();
  const rwf = (v: number) => `RWF ${v.toLocaleString('en-RW')}`;
  return (
    <>
      <div className="page-heading"><div><h1>Financial overview</h1><p>Monday overview of the Ikibina savings group</p></div><button className="secondary-button"><Download size={14}/>Export report</button></div>
      <div className="metrics-grid">
        <Metric label="Registered members" value={String(d.members)} note={`${d.active} active · ${d.inactive} inactive`} icon={Users}/>
        <Metric label="Contributions collected" value={rwf(d.contributions)} note="Paid monthly obligations" icon={WalletCards} tone="green"/>
        <Metric label="Outstanding obligations" value={rwf(d.outstanding)} note="Contributions not yet paid" icon={AlertTriangle} tone="amber"/>
        <Metric label="Available cash" value={rwf(d.cash)} note="Current group cash balance" icon={CircleDollarSign} tone="green"/>
        <Metric label="Penalties assessed" value={rwf(d.penaltiesAssessed)} note={`${rwf(d.penaltiesCollected)} collected`} icon={AlertTriangle} tone="red"/>
        <Metric label="Loans issued" value={rwf(d.loans)} note="Principal disbursement" icon={HandCoins}/>
        <Metric label="Loan repayments" value={rwf(d.loanRepayments)} note="Collected from members" icon={CircleDollarSign} tone="green"/>
        <Metric label="Group expenses" value={rwf(d.expenses)} note="Approved spending" icon={ReceiptText} tone="red"/>
      </div>
      <section className="dashboard-grid">
        <article className="panel-card"><div className="panel-head"><h2>Financial activity</h2><button className="secondary-button" style={{minHeight:30,padding:'5px 8px'}}>Last 6 months</button></div><div className="panel-body"><div className="chart-placeholder">Live charts appear after Supabase queries are connected</div></div></article>
        <article className="panel-card"><div className="panel-head"><h2>Recent activity</h2><a className="secondary-button" href="/transactions" style={{minHeight:30,padding:'5px 8px'}}>View all</a></div><div className="panel-body"><div className="activity-list"><div className="empty-state"><div><strong>No recent activity</strong><span>Member, payment and expense records will appear here.</span></div></div></div></div></article>
      </section>
    </>
  );
}
