import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Members | Ikibina' };

export default function Page() {
  return (
    <>
      <div className="page-heading"><div><h1>Members</h1><p>Register and maintain savings group member records</p></div><button className="primary-button">+ Add member</button></div>
      <div className="panel-card">
        <div className="panel-head"><h2>Member directory</h2><span style={{color:'#718096',fontSize:10}}>0 members</span></div>
        <div className="empty-state"><div><strong>No members registered</strong><span>New member records will appear in this directory.</span></div></div>
      </div>
    </>
  );
}
