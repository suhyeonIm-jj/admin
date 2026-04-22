"use client";

import { Link, Category } from "@/types";

interface LinkCardProps {
  link: Link;
  view?: "card" | "list" | "compact";
  category?: Category;
  onEdit?: (link: Link) => void;
  onDelete?: (id: string) => void;
  onTogglePin?: (id: string, isPinned: boolean) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  onClick?: (link: Link) => void;
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 14 14"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    >
      <path d="M7 1.5l1.7 3.55 3.9.48-2.88 2.68.74 3.85L7 10.24 3.54 12.06l.74-3.85L1.4 5.53l3.9-.48L7 1.5z" />
    </svg>
  );
}

function Favicon({ link }: { link: Link }) {
  const colors = [
    { bg: "#E6EAF2", fg: "#1F2B4D" },
    { bg: "#F2E6EA", fg: "#7A2E2B" },
    { bg: "#E6F2EA", fg: "#2B4D3A" },
    { bg: "#F2F0E6", fg: "#4D4A2B" },
  ];
  const colorIndex = link.title.charCodeAt(0) % colors.length;
  const { bg, fg } = colors[colorIndex];

  if (link.favicon) {
    return (
      <div className="favicon" style={{ background: bg }}>
        <img
          src={link.favicon}
          alt=""
          style={{ width: "18px", height: "18px", objectFit: "contain" }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
            (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
          }}
        />
        <span className="favicon-letter hidden" style={{ color: fg }}>
          {link.title.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <div className="favicon" style={{ background: bg, color: fg }}>
      <span className="favicon-letter">{link.title.charAt(0).toUpperCase()}</span>
    </div>
  );
}

function getDisplayUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace("www.", "");
  } catch {
    return url;
  }
}

function DeleteIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4h10M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1M11 4v7a1 1 0 01-1 1H4a1 1 0 01-1-1V4M6 7v3M8 7v3" />
    </svg>
  );
}

// Card View Component
function LinkCardView({
  link,
  category,
  onTogglePin,
  onDelete,
  onClick,
}: {
  link: Link;
  category?: Category;
  onTogglePin?: (id: string, isPinned: boolean) => void;
  onDelete?: (id: string) => void;
  onClick?: () => void;
}) {
  const handleClick = () => {
    onClick?.();
    window.open(link.url, "_blank");
  };

  return (
    <div className="link-card" onClick={handleClick}>
      <div className="card-top">
        <Favicon link={link} />
        <div className="card-actions">
          <button
            className="delete-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("이 링크를 삭제하시겠습니까?")) {
                onDelete?.(link.id);
              }
            }}
            title="삭제"
          >
            <DeleteIcon />
          </button>
          <button
            className={`pin-btn ${link.isFavorite ? "pinned" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin?.(link.id, !link.isFavorite);
            }}
            title={link.isFavorite ? "즐겨찾기 해제" : "즐겨찾기"}
          >
            <StarIcon filled={link.isFavorite} />
          </button>
        </div>
      </div>
      <div className="card-body">
        <div className="card-title">{link.title}</div>
        <div className="card-url">{getDisplayUrl(link.url)}</div>
      </div>
      <div className="card-foot">
        <div className="tags">
          {link.tags.slice(0, 2).map((t) => (
            <span key={t} className="tag-chip sm">
              #{t}
            </span>
          ))}
        </div>
        {category && (
          <div className="card-cat">
            <span className="cat-dot" style={{ background: category.color }}></span>
            <span className="cat-name">{category.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// List View Component
function LinkRowView({
  link,
  category,
  onTogglePin,
  onDelete,
  onClick,
}: {
  link: Link;
  category?: Category;
  onTogglePin?: (id: string, isPinned: boolean) => void;
  onDelete?: (id: string) => void;
  onClick?: () => void;
}) {
  const handleClick = () => {
    onClick?.();
    window.open(link.url, "_blank");
  };

  return (
    <div className="link-row" onClick={handleClick}>
      <button
        className={`pin-btn inline ${link.isFavorite ? "pinned" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onTogglePin?.(link.id, !link.isFavorite);
        }}
      >
        <StarIcon filled={link.isFavorite} />
      </button>
      <Favicon link={link} />
      <div className="row-main">
        <div className="row-title">{link.title}</div>
        <div className="row-url">{getDisplayUrl(link.url)}</div>
      </div>
      <div className="row-tags">
        {link.tags.slice(0, 3).map((t) => (
          <span key={t} className="tag-chip sm">
            #{t}
          </span>
        ))}
      </div>
      <div className="row-category">
        {category && (
          <>
            <span className="cat-dot" style={{ background: category.color }}></span>
            {category.name}
          </>
        )}
      </div>
      <div className="row-actions">
        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm("이 링크를 삭제하시겠습니까?")) {
              onDelete?.(link.id);
            }
          }}
          title="삭제"
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
}

// Compact View Component
function LinkCompactView({
  link,
  onDelete,
  onClick,
}: {
  link: Link;
  onDelete?: (id: string) => void;
  onClick?: () => void;
}) {
  const handleClick = () => {
    onClick?.();
    window.open(link.url, "_blank");
  };

  return (
    <div className="link-compact" onClick={handleClick}>
      <Favicon link={link} />
      <div className="compact-title">{link.title}</div>
      <div className="compact-url">{getDisplayUrl(link.url)}</div>
      <button
        className="delete-btn compact"
        onClick={(e) => {
          e.stopPropagation();
          if (confirm("이 링크를 삭제하시겠습니까?")) {
            onDelete?.(link.id);
          }
        }}
        title="삭제"
      >
        <DeleteIcon />
      </button>
    </div>
  );
}

export default function LinkCard({
  link,
  view = "card",
  category,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleFavorite,
  onClick,
}: LinkCardProps) {
  const handleClick = async () => {
    try {
      await fetch(`/api/links/${link.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "incrementUsage" }),
      });
    } catch (error) {
      console.error("Failed to increment usage count");
    }
    onClick?.(link);
  };

  const handleTogglePin = (id: string, value: boolean) => {
    onToggleFavorite?.(id, value);
  };

  if (view === "list") {
    return (
      <LinkRowView
        link={link}
        category={category}
        onTogglePin={handleTogglePin}
        onDelete={onDelete}
        onClick={handleClick}
      />
    );
  }

  if (view === "compact") {
    return <LinkCompactView link={link} onDelete={onDelete} onClick={handleClick} />;
  }

  return (
    <LinkCardView
      link={link}
      category={category}
      onTogglePin={handleTogglePin}
      onDelete={onDelete}
      onClick={handleClick}
    />
  );
}

export { LinkCardView, LinkRowView, LinkCompactView, Favicon, StarIcon };
