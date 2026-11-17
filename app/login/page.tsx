import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Login | Ikibina' };

export default function LoginPage() {
  return (
    <main style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'linear-gradient(145deg,#102a43,#183d5f)',padding:20}}>
      <form style={{width:'min(420px,100%)',background:'#fff',borderRadius:16,padding:30,display:'grid',gap:14,boxShadow:'0 24px 70px rgba(7,24,39,.35)',fontFamily:'Manrope,Arial,sans-serif'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}><div style={{width:42,height:42,borderRadius:11,background:'#d5aa50',color:'#102a43',display:'grid',placeItems:'center',fontWeight:800}}>I</div><div><strong style={{letterSpacing:'0.08em'}}>IKIBINA</strong><div style={{fontSize:11,color:'#718096'}}>Leader sign in</div></div></div>
        <label style={{display:'grid',gap:6,fontSize:11,fontWeight:800,color:'#61758a'}}>Email<input name="email" type="email" required style={{border:'1px solid #dfe7ef',borderRadius:8,padding:'11px'}}/></label>
        <label style={{display:'grid',gap:6,fontSize:11,fontWeight:800,color:'#61758a'}}>Password<input name="password" type="password" required style={{border:'1px solid #dfe7ef',borderRadius:8,padding:'11px'}}/></label>
        <button type="submit" style={{border:0,borderRadius:8,padding:'11px',background:'#102a43',color:'#fff',fontWeight:800}}>Sign in</button>
        <a href="/login/reset" style={{fontSize:11,textAlign:'center',color:'#2f70a8',textDecoration:'none'}}>Reset password</a>
      </form>
    </main>
  );
}
