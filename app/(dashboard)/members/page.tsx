'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const supabase = createClient();

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: false });
    if (error) setError(error.message); else setMembers(data || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function register(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = { member_number:String(form.get('member_number')).trim(), full_name:String(form.get('full_name')).trim(), phone_number:String(form.get('phone_number')).trim(), joining_date:form.get('joining_date'), contribution_category:form.get('contribution_category'), status:form.get('status'), address:String(form.get('address')||'').trim() || null };
    const { error } = await supabase.from('members').insert(payload);
    if (error) { setError(error.message); return; }
    event.currentTarget.reset(); await load();
  }

  return <><div style={{display:'flex',justifyContent:'space-between',marginBottom:18}}><div><h1 style={{margin:0,fontSize:21}}>Members</h1><p style={{margin:'5px 0 0',color:'#718096',fontSize:12}}>Manage member profiles and contribution categories</p></div></div>{error&&<div style={{background:'#fff0ef',color:'#b83e3e',padding:12,borderRadius:8,marginBottom:14,fontSize:12}}>{error}</div>}<div style={{display:'grid',gridTemplateColumns:'360px 1fr',gap:14}}><form onSubmit={register} style={{background:'#fff',border:'1px solid #e3eaf1',borderRadius:14,padding:18,display:'grid',gap:10,height:'fit-content'}}><h3 style={{margin:'0 0 4px'}}>Register member</h3>{[['Full name','full_name','text'],['Member number','member_number','text'],['Phone number','phone_number','tel'],['Joining date','joining_date','date']].map(([label,name,type])=> <label key={name} style={{display:'grid',gap:5,fontSize:11,fontWeight:700,color:'#61758a'}}>{label}<input name={name} type={type} required style={{border:'1px solid #dfe7ef',borderRadius:8,padding:'9px 10px'}} /></label>)}<label style={{display:'grid',gap:5,fontSize:11,fontWeight:700,color:'#61758a'}}>Contribution category<select name="contribution_category" style={{border:'1px solid #dfe7ef',borderRadius:8,padding:'9px 10px'}}><option value="A">Category A — RWF 10,000</option><option value="B">Category B — RWF 15,000</option></select></label><label style={{display:'grid',gap:5,fontSize:11,fontWeight:700,color:'#61758a'}}>Status<select name="status" style={{border:'1px solid #dfe7ef',borderRadius:8,padding:'9px 10px'}}><option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option></select></label><label style={{display:'grid',gap:5,fontSize:11,fontWeight:700,color:'#61758a'}}>Address<input name="address" style={{border:'1px solid #dfe7ef',borderRadius:8,padding:'9px 10px'}} /></label><button style={{border:0,borderRadius:8,padding:'10px',background:'#102b46',color:'#fff',fontWeight:700}}>Save member</button></form><div style={{background:'#fff',border:'1px solid #e3eaf1',borderRadius:14,overflow:'hidden'}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}><thead><tr style={{background:'#f8fafc',color:'#718096',textAlign:'left'}}>{['Member','Number','Category','Status'].map(h=><th key={h} style={{padding:12,borderBottom:'1px solid #e7edf3'}}>{h}</th>)}</tr></thead><tbody>{loading?<tr><td colSpan={4} style={{padding:20}}>Loading…</td></tr>:members.map(m=><tr key={m.id}><td style={{padding:12,borderBottom:'1px solid #edf2f6',fontWeight:700}}>{m.full_name}</td><td style={{padding:12,borderBottom:'1px solid #edf2f6'}}>{m.member_number}</td><td style={{padding:12,borderBottom:'1px solid #edf2f6'}}>Category {m.contribution_category}</td><td style={{padding:12,borderBottom:'1px solid #edf2f6'}}>{m.status}</td></tr>)}</tbody></table></div></div></>;
}
