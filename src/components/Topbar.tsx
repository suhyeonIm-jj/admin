"use client";

interface TopbarProps {
  workspace: "work" | "personal";
  view: "card" | "list" | "compact";
  setView: (v: "card" | "list" | "compact") => void;
  onAdd: () => void;
  onOpenCommand: () => void;
}

export default function Topbar({
  workspace,
  view,
  setView,
  onAdd,
  onOpenCommand,
}: TopbarProps) {
  const title = workspace === "work" ? "업무 링크" : "개인 북마크";
  const subtitle =
    workspace === "work"
      ? "자주 이동하는 업무 도구와 페이지를 한 곳에서"
      : "저장해둔 사이트와 자주 찾는 페이지";

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="breadcrumb">
          <span className="crumb-muted">{workspace === "work" ? "Workspace" : "Personal"}</span>
          <span className="crumb-sep">/</span>
          <span className="crumb-active">{title}</span>
        </div>
        <h1 className="page-title">{title}</h1>
        <div className="page-sub">{subtitle}</div>
      </div>

      <div className="topbar-right">
        <button className="search-trigger" onClick={onOpenCommand}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.3"/>
            <path d="M9 9l3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          <span>링크, 카테고리, 태그 검색</span>
          <kbd>⌘K</kbd>
        </button>

        <div className="toolbar">
          <div className="segmented">
            <button
              className={view === "card" ? "seg active" : "seg"}
              onClick={() => setView("card")}
              title="카드 뷰"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <rect x="1.5" y="1.5" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="7.5" y="1.5" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="1.5" y="7.5" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2"/>
                <rect x="7.5" y="7.5" width="4" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
            </button>
            <button
              className={view === "list" ? "seg active" : "seg"}
              onClick={() => setView("list")}
              title="리스트 뷰"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M2 3h9M2 6.5h9M2 10h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              className={view === "compact" ? "seg active" : "seg"}
              onClick={() => setView("compact")}
              title="컴팩트 뷰"
            >
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <circle cx="3" cy="3" r="1" fill="currentColor"/>
                <circle cx="6.5" cy="3" r="1" fill="currentColor"/>
                <circle cx="10" cy="3" r="1" fill="currentColor"/>
                <circle cx="3" cy="6.5" r="1" fill="currentColor"/>
                <circle cx="6.5" cy="6.5" r="1" fill="currentColor"/>
                <circle cx="10" cy="6.5" r="1" fill="currentColor"/>
                <circle cx="3" cy="10" r="1" fill="currentColor"/>
                <circle cx="6.5" cy="10" r="1" fill="currentColor"/>
                <circle cx="10" cy="10" r="1" fill="currentColor"/>
              </svg>
            </button>
          </div>

          <button className="btn-primary" onClick={onAdd}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M6.5 2.5v8M2.5 6.5h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            링크 추가
          </button>
        </div>
      </div>
    </header>
  );
}
