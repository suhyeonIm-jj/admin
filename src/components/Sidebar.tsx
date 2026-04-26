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
  workCount: number;
  personalCount: number;
  user?: UserInfo | null;
  onLogout?: () => void;
}

export default function Sidebar({
  workspace,
  setWorkspace,
  workCount,
  personalCount,
  user,
  onLogout,
}: SidebarProps) {
  const [showLogoutHint, setShowLogoutHint] = useState(false);

  const today = new Date();
  const dateStr = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  const getInitials = (name: string) => name.slice(0, 2).toUpperCase();

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
          <button
            className={`nav-item ${workspace === "work" ? "active" : ""}`}
            onClick={() => setWorkspace("work")}
          >
            <span className="ws-dot work" />
            <span>업무</span>
            <span className="nav-count">{workCount}</span>
          </button>
          <button
            className={`nav-item ${workspace === "personal" ? "active" : ""}`}
            onClick={() => setWorkspace("personal")}
          >
            <span className="ws-dot personal" />
            <span>개인</span>
            <span className="nav-count">{personalCount}</span>
          </button>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-date">{dateStr}</div>
        {user ? (
          <div
            className="user-card"
            onMouseEnter={() => setShowLogoutHint(true)}
            onMouseLeave={() => setShowLogoutHint(false)}
          >
            <div className="avatar">{getInitials(user.name)}</div>
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-email">{user.email}</div>
            </div>
            {showLogoutHint && (
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
