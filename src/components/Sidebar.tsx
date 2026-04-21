"use client";

import { Category } from "@/types";

interface CategoryWithCount extends Category {
  count?: number;
}

interface UserInfo {
  id: string;
  email: string;
  name: string;
}

interface SidebarProps {
  workspace: "work" | "personal";
  setWorkspace: (ws: "work" | "personal") => void;
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  categories: CategoryWithCount[];
  counts: {
    work: number;
    personal: number;
    total: number;
    pinned: number;
    recent: number;
  };
  tags: string[];
  user?: UserInfo | null;
  onLogout?: () => void;
}

export default function Sidebar({
  workspace,
  setWorkspace,
  activeCategory,
  setActiveCategory,
  categories,
  counts,
  tags,
  user,
  onLogout,
}: SidebarProps) {
  const today = new Date();
  const dateStr = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const getInitials = (name: string) => {
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-mark">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9"/>
              <rect x="10" y="2" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5"/>
              <rect x="2" y="10" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5"/>
              <rect x="10" y="10" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9"/>
            </svg>
          </div>
          <div className="logo-text">
            <div className="logo-title">Damin Hub</div>
            <div className="logo-sub">admin workspace</div>
          </div>
        </div>
      </div>

      <div className="workspace-switch">
        <button
          className={`ws-btn ${workspace === "work" ? "active" : ""}`}
          onClick={() => setWorkspace("work")}
        >
          <span className="ws-dot work"></span>
          업무
          <span className="ws-count">{counts.work}</span>
        </button>
        <button
          className={`ws-btn ${workspace === "personal" ? "active" : ""}`}
          onClick={() => setWorkspace("personal")}
        >
          <span className="ws-dot personal"></span>
          개인
          <span className="ws-count">{counts.personal}</span>
        </button>
      </div>

      <nav className="nav">
        <div className="nav-section">
          <div className="nav-label">둘러보기</div>
          <button
            className={`nav-item ${activeCategory === "all" ? "active" : ""}`}
            onClick={() => setActiveCategory("all")}
          >
            <IconGrid />
            <span>전체</span>
            <span className="nav-count">{counts.total}</span>
          </button>
          <button
            className={`nav-item ${activeCategory === "pinned" ? "active" : ""}`}
            onClick={() => setActiveCategory("pinned")}
          >
            <IconStar />
            <span>즐겨찾기</span>
            <span className="nav-count">{counts.pinned}</span>
          </button>
          <button
            className={`nav-item ${activeCategory === "recent" ? "active" : ""}`}
            onClick={() => setActiveCategory("recent")}
          >
            <IconClock />
            <span>최근 방문</span>
            <span className="nav-count">{counts.recent}</span>
          </button>
        </div>

        <div className="nav-section">
          <div className="nav-label">카테고리</div>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`nav-item ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="cat-dot" style={{ background: cat.color }}></span>
              <span>{cat.name}</span>
              <span className="nav-count">{cat.count || 0}</span>
            </button>
          ))}
          <button className="nav-item add-cat">
            <IconPlus />
            <span>카테고리 추가</span>
          </button>
        </div>

        <div className="nav-section">
          <div className="nav-label">태그</div>
          <div className="tag-cloud">
            {tags.slice(0, 8).map((t) => (
              <span key={t} className="tag-chip">#{t}</span>
            ))}
          </div>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-date">{dateStr}</div>
        {user ? (
          <div className="user-card">
            <div className="avatar">{getInitials(user.name)}</div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
            </div>
            <button className="icon-btn" title="로그아웃" onClick={onLogout}>
              <IconLogout />
            </button>
          </div>
        ) : (
          <div className="user-card">
            <div className="avatar">?</div>
            <div className="user-info">
              <div className="user-name">게스트</div>
              <div className="user-email">로그인이 필요합니다</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function IconGrid() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <rect x="2" y="2" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="8.5" y="2" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="2" y="8.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
      <rect x="8.5" y="8.5" width="4.5" height="4.5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
    </svg>
  );
}

function IconStar() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
      <path d="M7 1.5l1.7 3.55 3.9.48-2.88 2.68.74 3.85L7 10.24 3.54 12.06l.74-3.85L1.4 5.53l3.9-.48L7 1.5z"/>
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.3"/>
      <path d="M7.5 4.5v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
      <path d="M7.5 3v9M3 7.5h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 2H3a1 1 0 00-1 1v8a1 1 0 001 1h2M9 10l3-3-3-3M12 7H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
