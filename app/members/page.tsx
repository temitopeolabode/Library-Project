import { Suspense } from "react";
import { UsersRound } from "lucide-react";
import { getMembers } from "@/db";
import { AddMemberForm } from "../components/add-member-form";
import { MemberControls } from "../components/member-controls";
import { SideNav } from "../components/side-nav";

async function MembersContent() {
  const members = await getMembers();

  return (
    <section className="collection-section" aria-labelledby="members-heading">
      <div className="section-heading"><div><span className="eyebrow">OUR READERS</span><h2 id="members-heading">People behind the pages.</h2></div><span className="collection-count">{members.length} MEMBERS</span></div>
      <div className="member-list">
        {members.length ? members.map((member, index) => (
          <article className="member-row" key={member.id}>
            <div className={`member-avatar avatar-${index % 5}`}>{member.name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}</div>
            <div className="member-details"><h3>{member.name}</h3><p>{member.phone || "No phone number"}</p></div>
            <span className="member-index">{String(index + 1).padStart(2, "0")}</span>
            <MemberControls id={member.id} name={member.name} />
          </article>
        )) : <div className="empty-state"><UsersRound size={26} strokeWidth={1.5} /><p>No members registered yet.</p></div>}
      </div>
    </section>
  );
}

function MembersFallback() {
  return <div className="loading-list" role="status">Opening the members list…</div>;
}

export default function MembersPage() {
  return (
    <div className="app-frame">
      <SideNav current="members" />
      <main className="main-panel">
        <header className="page-header"><div><p className="breadcrumb">LIBRARY <span>/</span> MEMBERS</p><h1>Members</h1></div><div className="header-note"><span className="live-dot" /> Synced with your library</div></header>
        <div className="page-content">
          <section className="intro-band members-intro"><div className="intro-copy"><span className="eyebrow">THE PEOPLE WHO MAKE IT A LIBRARY</span><h2>Readers make<br />the stories.</h2><p>Keep track of everyone borrowing from the collection.</p></div><div className="member-stamp" aria-hidden="true"><UsersRound size={39} strokeWidth={1.2} /><span>READ<br />TOGETHER</span></div></section>
          <Suspense fallback={<MembersFallback />}><MembersContent /></Suspense>
          <section className="add-section" aria-labelledby="add-member-heading"><div className="section-heading"><div><span className="eyebrow">WELCOME SOMEONE NEW</span><h2 id="add-member-heading">Add a member</h2></div></div><AddMemberForm /></section>
        </div>
      </main>
    </div>
  );
}