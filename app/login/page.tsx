'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [error,setError]=useState('');
  const supabase=createClient();
  async function login(event:React.FormEvent<HTMLFormElement>) { event.preventDefault(); const f=new FormData(event.currentTarget); const {error}=await supabase.auth.signInWithPassword({email:String(f.get('email')),password:String(f.get('password'))}); if(error)setError(error.message); else window.location.href='/dashboard'; }
  return <main style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'linear-gradient(145deg,#102b46,#183d5f)',padding:20}}><form onSubmit={login} style={{width:'min(420px,100%)',background:'#fff',borderRadius:16,padding:30,display:'grid',gap:14,boxShadow:'0 24px 70px #07182755'}}><div style={{display:'flex',alignItems:'center',gap:12}}><div style={{width:42,height:42,borderRadius:11,background:'#d0a64d',color:'#102b46',display:'grid',placeItems:'center',fontWeight:900}}>I</div><div><strong>IKIBINA</strong><div style={{fontSize:11,color:'#718096'}}>Leader login</div></div></div>{error&&<div style={{background:'#ffecec',color:'#b83e3e',padding:10,borderRadius:8,fontSize:12}}>{error}</div>}<label style={{display:'grid',gap:6,fontSize:12,fontWeight:700,color:'#61758a'}}>Email<input name="email" type="email" required style={{border:'1px solid #dfe7ef',borderRadius:8,padding:'11px'}} /></label><label style={{display:'grid',gap:6,fontSize:12,fontWeight:700,color:'#61758a'}}>Password<input name="password" type="password" required style={{border:'1px solid #dfe7ef',borderRadius:8,padding:'11px'}} /></label><button style={{border:0,borderRadius:8,padding:'11px',background:'#102b46',color:'#fff',fontWeight:700}}>Sign in</button><a href="/login/reset" style={{fontSize:12,textAlign:'center',color:'#316fa7'}}>Reset password</a></form></main>;
}
