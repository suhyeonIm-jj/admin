"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Link, Category } from "@/types";
import { Favicon } from "./LinkCard";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  links: Link[];
  categories: Category[];
}

function getDisplayUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export default function CommandPalette({
  open,
  onClose,
  links,
  categories,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 40);
    }
    if (!open) {
      setQuery("");
      setHighlightIndex(0);
    }
  }, [open]);

  const filtered = query
    ? links
        .filter(
          (l) =>
            l.title.toLowerCase().includes(query.toLowerCase()) ||
            l.url.toLowerCase().includes(query.toLowerCase()) ||
            l.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 8)
    : links.filter((l) => l.isFavorite || l.isPinned).slice(0, 6);

  const getCategoryForLink = (link: Link) => {
    return categories.find((c) => c.id === link.category);
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const link = filtered[highlightIndex];
        if (link) {
          window.open(link.url, "_blank");
          onClose();
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [filtered, highlightIndex, onClose]
  );

  useEffect(() => {
    setHighlightIndex(0);
  }, [query]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        // Toggle is handled by parent
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  if (!open) return null;

  return (
    <div className="cmd-overlay" onClick={onClose}>
      <div className="cmd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cmd-input-wrap">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="링크 제목, URL, #태그로 검색..."
          />
          <kbd className="cmd-kbd">ESC</kbd>
        </div>

        <div className="cmd-section-label">
          {query ? `검색 결과 · ${filtered.length}` : "고정된 링크"}
        </div>

        <div className="cmd-list">
          {filtered.map((link, i) => {
            const category = getCategoryForLink(link);
            return (
              <a
                key={link.id}
                href={link.url}
                className={`cmd-item ${i === highlightIndex ? "hl" : ""}`}
                target="_blank"
                rel="noreferrer"
                onMouseEnter={() => setHighlightIndex(i)}
                onClick={() => onClose()}
              >
                <Favicon link={link} />
                <div className="cmd-item-main">
                  <div className="cmd-item-title">{link.title}</div>
                  <div className="cmd-item-url">{getDisplayUrl(link.url)}</div>
                </div>
                <div className="cmd-item-meta">
                  {category && (
                    <>
                      <span className="cat-dot" style={{ background: category.color }}></span>
                      <span>{category.name}</span>
                    </>
                  )}
                </div>
                <kbd className="cmd-kbd">↵</kbd>
              </a>
            );
          })}
          {filtered.length === 0 && (
            <div className="cmd-empty">일치하는 결과가 없어요</div>
          )}
        </div>

        <div className="cmd-footer">
          <div className="cmd-hint">
            <kbd>↑</kbd>
            <kbd>↓</kbd> 이동
          </div>
          <div className="cmd-hint">
            <kbd>↵</kbd> 열기
          </div>
          <div className="cmd-hint">
            <kbd>⌘</kbd>
            <kbd>↵</kbd> 새 탭
          </div>
          <div className="cmd-hint right">
            <span className="dot-live"></span> 실시간 검색
          </div>
        </div>
      </div>
    </div>
  );
}
