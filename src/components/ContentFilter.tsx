"use client";

import { Category } from "@/types";
import { useState, useRef } from "react";

interface CategoryWithCount extends Category {
  count?: number;
}

interface ContentFilterProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  categories: CategoryWithCount[];
  counts: { total: number; pinned: number; recent: number };
  tags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onRenameCategory?: (id: string, name: string) => void;
  onDeleteCategory?: (id: string) => void;
  onAddCategory?: (name: string) => void;
}

export default function ContentFilter({
  activeCategory,
  setActiveCategory,
  categories,
  counts,
  tags,
  selectedTags,
  onToggleTag,
  onRenameCategory,
  onDeleteCategory,
  onAddCategory,
}: ContentFilterProps) {
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
    const linkCount = cat.count || 0;
    const msg =
      linkCount > 0
        ? `"${cat.name}" 카테고리를 삭제하시겠습니까?\n\n포함된 링크 ${linkCount}개도 함께 삭제됩니다.`
        : `"${cat.name}" 카테고리를 삭제하시겠습니까?`;
    if (confirm(msg)) {
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

  return (
    <div className="content-filter">
      <div className="filter-row">
        <button
          className={`filter-pill ${activeCategory === "all" ? "active" : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          <IconGrid />
          전체
          <span className="filter-pill-count">{counts.total}</span>
        </button>
        <button
          className={`filter-pill ${activeCategory === "pinned" ? "active" : ""}`}
          onClick={() => setActiveCategory("pinned")}
        >
          <IconStar />
          즐겨찾기
          <span className="filter-pill-count">{counts.pinned}</span>
        </button>
        <button
          className={`filter-pill ${activeCategory === "recent" ? "active" : ""}`}
          onClick={() => setActiveCategory("recent")}
        >
          <IconClock />
          최근 방문
          <span className="filter-pill-count">{counts.recent}</span>
        </button>

        {categories.length > 0 && <span className="filter-divider" />}

        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`cat-chip ${activeCategory === cat.id ? "active" : ""}`}
            onMouseEnter={() => setHoveredCatId(cat.id)}
            onMouseLeave={() => setHoveredCatId(null)}
            onClick={() => editingCatId !== cat.id && setActiveCategory(cat.id)}
          >
            <span className="chip-dot" style={{ background: cat.color }} />
            {editingCatId === cat.id ? (
              <input
                ref={editInputRef}
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => saveRename(cat)}
                onKeyDown={(e) => handleRenameKeyDown(e, cat)}
                onClick={(e) => e.stopPropagation()}
                className="chip-edit-input"
              />
            ) : (
              <>
                <span className="chip-name">{cat.name}</span>
                <span className="chip-count">{cat.count || 0}</span>
              </>
            )}
            {editingCatId !== cat.id && (
              <span
                className="chip-actions"
                style={{
                  opacity: hoveredCatId === cat.id ? 1 : 0,
                  pointerEvents: hoveredCatId === cat.id ? "auto" : "none",
                  transition: "opacity 0.12s",
                }}
              >
                {onRenameCategory && (
                  <button
                    className="chip-action-btn"
                    onClick={(e) => startRename(e, cat)}
                    title="이름 변경"
                  >
                    <IconEdit />
                  </button>
                )}
                {onDeleteCategory && (
                  <button
                    className="chip-action-btn del"
                    onClick={(e) => handleDelete(e, cat)}
                    title="삭제"
                  >
                    <IconTrash />
                  </button>
                )}
              </span>
            )}
          </div>
        ))}

        {isAddingCat ? (
          <div className="cat-chip adding">
            <input
              ref={addInputRef}
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onBlur={saveAddCategory}
              onKeyDown={handleAddKeyDown}
              placeholder="카테고리 이름"
              className="chip-edit-input"
            />
          </div>
        ) : (
          <button className="filter-pill add-cat" onClick={startAddCategory}>
            <IconPlus />
            추가
          </button>
        )}
      </div>

      {tags.length > 0 && (
        <div className="filter-row">
          {tags.map((tag) => (
            <button
              key={tag}
              className={`tag-filter-chip ${selectedTags.includes(tag) ? "active" : ""}`}
              onClick={() => onToggleTag(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function IconGrid() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect x="1" y="1" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="7" y="1" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="1" y="7" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
      <rect x="7" y="7" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
      <path d="M7 1.5l1.7 3.55 3.9.48-2.88 2.68.74 3.85L7 10.24 3.54 12.06l.74-3.85L1.4 5.53l3.9-.48L7 1.5z" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 4v3l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2l2 2-7 7H3v-2l7-7z" />
      <path d="M8.5 3.5l2 2" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4h10M5 4V3a1 1 0 011-1h2a1 1 0 011 1v1M11 4v7a1 1 0 01-1 1H4a1 1 0 01-1-1V4M6 7v3M8 7v3" />
    </svg>
  );
}
