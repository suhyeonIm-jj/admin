"use client";

import { useState } from "react";

interface UserInfo {
  id: string;
  email: string;
  name: string;
}

interface SidebarProps {
  workspace: "work" | "personal";
  setWorkspace: (ws: "work" | "personal") => void;
  viewMode: "all" | "pinned" | "recent";
  setViewMode: (mode: "all" | "pinned" | "recent") => void;
  workCount: number;
  personalCount: number;
  pinnedCount: number;
  recentCount: number;
  user?: UserInfo | null;
  onLogout?: () => void;
}

export default function Sidebar({
  workspace,
  setWorkspace,
  viewMode,
  setViewMode,
  workCount,
  personalCount,
  pinnedCount,
  recentCount,
  user,
  onLogout,
}: SidebarProps) {
  const [showLogoutBtn, setShowLogoutBtn] = useState(false);

  const today = new Date();
  const dateStr = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

  const subItems: { mode: "all" | "pinned" | "recent"; label: string; count: number; icon: React.ReactNode }[] = [
    { mode: "all", label: "전체", count: workspace === "work" ? workCount : personalCount, icon: <IconGrid /> },
    { mode: "pinned", label: "즐겨찾기", count: pinnedCount, icon: <IconStar /> },
    { mode: "recent", label: "최근 방문", count: recentCount, icon: <IconClock /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-mark">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9" />
              <rect x="10" y="2" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
              <rect x="2" y="10" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
              <rect x="10" y="10" width="6" height="6" rx="1.5" fill="currentColor" opacity="0.9" />
            </svg>
          </div>
          <div className="logo-text">
            <div className="logo-title">Damin Hub</div>
            <div className="logo-sub">admin workspace</div>
          </div>
        </div>
      </div>

      <nav className="nav">
        <div className="nav-section">
          <div className="nav-label">워크스페이스</div>

          {/* Work */}
          <button
            className={`nav-item ${workspace === "work" ? "active" : ""}`}
            onClick={() => { setWorkspace("work"); setViewMode("all"); }}
          >
            <span className="ws-dot work" />
            <span>업무</span>
            <span className="nav-count">{workCount}</span>
          </button>
          {workspace === "work" && (
            <div className="nav-sub">
              {subItems.map(({ mode, label, count, icon }) => (
                <button
                  key={mode}
                  className={`nav-sub-item ${viewMode === mode ? "active" : ""}`}
                  onClick={() => setViewMode(mode)}
                >
                  {icon}
                  <span>{label}</span>
                  <span className="nav-count">{count}</span>
                </button>
              ))}
            </div>
          )}

          {/* Personal */}
          <button
            className={`nav-item ${workspace === "personal" ? "active" : ""}`}
            onClick={() => { setWorkspace("personal"); setViewMode("all"); }}
          >
            <span className="ws-dot personal" />
            <span>개인</span>
            <span className="nav-count">{personalCount}</span>
          </button>
          {workspace === "personal" && (
            <div className="nav-sub">
              {subItems.map(({ mode, label, count, icon }) => (
                <button
                  key={mode}
                  className={`nav-sub-item ${viewMode === mode ? "active" : ""}`}
                  onClick={() => setViewMode(mode)}
                >
                  {icon}
                  <span>{label}</span>
                  <span className="nav-count">{count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-date">{dateStr}</div>
        {user ? (
          <div
            className="user-card"
            onMouseEnter={() => setShowLogoutBtn(true)}
            onMouseLeave={() => setShowLogoutBtn(false)}
          >
            <div className="avatar">{getInitials(user.name)}</div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
            </div>
            {showLogoutBtn && (
              <button className="icon-btn" title="로그아웃" onClick={onLogout}>
                <IconLogout />
              </button>
            )}
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
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect x="1.5" y="1.5" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
      <rect x="7.5" y="1.5" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
      <rect x="1.5" y="7.5" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
      <rect x="7.5" y="7.5" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
      <path d="M7 1.5l1.7 3.55 3.9.48-2.88 2.68.74 3.85L7 10.24 3.54 12.06l.74-3.85L1.4 5.53l3.9-.48L7 1.5z" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 4v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M5 2H3a1 1 0 00-1 1v8a1 1 0 001 1h2M9 10l3-3-3-3M12 7H5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
