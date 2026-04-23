"use client";

import { Category } from "@/types";
import { useState, useRef } from "react";

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
  onRenameCategory?: (id: string, name: string) => void;
  onDeleteCategory?: (id: string) => void;
  onAddCategory?: (name: string) => void;
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
  onRenameCategory,
  onDeleteCategory,
  onAddCategory,
}: SidebarProps) {
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [hoveredCatId, setHoveredCatId] = useState<string | null>(null);
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  const startRename = (e: React.MouseEvent, cat: CategoryWithCount) => {
    e.stopPropagation();
    setEditingCatId(cat.id);
    setEditingName(cat.name);
    setTimeout(() => {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }, 0);
  };

  const saveRename = (cat: CategoryWithCount) => {
    const trimmed = editingName.trim();
    if (trimmed && trimmed !== cat.name) {
      onRenameCategory?.(cat.id, trimmed);
    }
    setEditingCatId(null);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent, cat: CategoryWithCount) => {
    if (e.key === "Enter") saveRename(cat);
    if (e.key === "Escape") setEditingCatId(null);
  };

  const handleDelete = (e: React.MouseEvent, cat: CategoryWithCount) => {
    e.stopPropagation();
    if (confirm(`"${cat.name}" 카테고리를 삭제하시겠습니까?\n카테고리에 속한 링크는 삭제되지 않습니다.`)) {
      onDeleteCategory?.(cat.id);
    }
  };

  const startAddCategory = () => {
    setIsAddingCat(true);
    setNewCatName("");
    setTimeout(() => addInputRef.current?.focus(), 0);
  };

  const saveAddCategory = () => {
    const trimmed = newCatName.trim();
    if (trimmed) {
      onAddCategory?.(trimmed);
    }
    setIsAddingCat(false);
    setNewCatName("");
  };

  const handleAddKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") saveAddCategory();
    if (e.key === "Escape") {
      setIsAddingCat(false);
      setNewCatName("");
    }
  };

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
            <div
              key={cat.id}
              className={`nav-item ${activeCategory === cat.id ? "active" : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() => editingCatId !== cat.id && setActiveCategory(cat.id)}
              onMouseEnter={() => setHoveredCatId(cat.id)}
              onMouseLeave={() => setHoveredCatId(null)}
            >
              <span className="cat-dot" style={{ background: cat.color }}></span>

              {editingCatId === cat.id ? (
                <>
                  <input
                    ref={editInputRef}
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => saveRename(cat)}
                    onKeyDown={(e) => handleRenameKeyDown(e, cat)}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-transparent outline-none border-b border-[var(--accent)] text-sm flex-1 min-w-0"
                  />
                  <span className="nav-count">{cat.count || 0}</span>
                </>
              ) : (
                <>
                  <span className="truncate" style={{ flex: "1 1 0", minWidth: 0 }}>{cat.name}</span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2px",
                      opacity: hoveredCatId === cat.id ? 1 : 0,
                      pointerEvents: hoveredCatId === cat.id ? "auto" : "none",
                      transition: "opacity 0.15s",
                      flexShrink: 0,
                    }}
                  >
                    {onRenameCategory && (
                      <button
                        onClick={(e) => startRename(e, cat)}
                        title="이름 변경"
                        style={{ color: "var(--fg-muted)", lineHeight: 1, padding: "1px" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
                      >
                        <IconEdit />
                      </button>
                    )}
                    {onDeleteCategory && (
                      <button
                        onClick={(e) => handleDelete(e, cat)}
                        title="삭제"
                        style={{ color: "var(--fg-muted)", lineHeight: 1, padding: "1px" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#e53e3e")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--fg-muted)")}
                      >
                        <IconTrash />
                      </button>
                    )}
                  </span>
                  <span className="nav-count" style={{ flexShrink: 0 }}>{cat.count || 0}</span>
                </>
              )}
            </div>
          ))}

          {isAddingCat ? (
            <div className="nav-item" style={{ gap: "6px" }}>
              <IconPlus />
              <input
                ref={addInputRef}
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                onBlur={saveAddCategory}
                onKeyDown={handleAddKeyDown}
                placeholder="카테고리 이름"
                className="bg-transparent outline-none border-b border-[var(--accent)] text-sm flex-1 min-w-0"
              />
            </div>
          ) : (
            <button className="nav-item add-cat" onClick={startAddCategory}>
              <IconPlus />
              <span>카테고리 추가</span>
            </button>
          )}
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

function IconEdit() {
  return (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2l2 2-7 7H3v-2l7-7z" />
      <path d="M8.5 3.5l2 2" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4h10M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1M11 4v7a1 1 0 01-1 1H4a1 1 0 01-1-1V4M6 7v3M8 7v3" />
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
