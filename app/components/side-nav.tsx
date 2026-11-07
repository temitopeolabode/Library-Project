import Link from "next/link";
import Image from "next/image";
import { BookOpen, LibraryBig, UsersRound } from "lucide-react";

export function SideNav({ current }: { current: "books" | "members" | "authors" }) {
  return (
    <aside className="side-nav">
      <Link className="brand" href="/" aria-label="Biblotheca home">
        <Image className="brand-mark" src="/biblotheca-mark.svg" alt="" width={42} height={42} priority />
        <span>Biblotheca</span>
      </Link>
      <p className="nav-caption">YOUR LIBRARY</p>
      <nav className="nav-links" aria-label="Main navigation">
        <Link className={current === "books" ? "nav-link active" : "nav-link"} href="/" title="Books" aria-label="Books">
          <BookOpen size={18} strokeWidth={1.8} />
          <span>Books</span>
        </Link>
        <Link className={current === "members" ? "nav-link active" : "nav-link"} href="/members" title="Members" aria-label="Members">
          <UsersRound size={18} strokeWidth={1.8} />
          <span>Members</span>
        </Link>
        <Link className={current === "authors" ? "nav-link active" : "nav-link"} href="/authors" title="Authors" aria-label="Authors">
          <LibraryBig size={18} strokeWidth={1.8} />
          <span>Authors</span>
        </Link>
      </nav>
      <div className="nav-footnote">
        <span className="live-dot" />
        <span>Community collection</span>
      </div>
    </aside>
  );
}