"use client";

import { Link, Category } from "@/types";
import LinkCard from "./LinkCard";
import { useState, useRef, useEffect } from "react";

interface CategorySectionProps {
  category: Category;
  links: Link[];
  onEditLink?: (link: Link) => void;
  onDeleteLink?: (id: string) => void;
  onTogglePin?: (id: string, isPinned: boolean) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  onRenameCategory?: (id: string, name: string) => void;
}

export default function CategorySection({
  category,
  links,
  onEditLink,
  onDeleteLink,
  onTogglePin,
  onToggleFavorite,
  onRenameCategory,
}: CategorySectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditName(category.name);
  }, [category.name]);

  const sortedLinks = [...links].sort((a, b) => a.order - b.order);

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditName(category.name);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const handleSaveName = () => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== category.name) {
      onRenameCategory?.(category.id, trimmed);
    } else {
      setEditName(category.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSaveName();
    if (e.key === "Escape") {
      setEditName(category.name);
      setIsEditing(false);
    }
  };

  if (links.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4 group/header">
        <button
          onClick={() => !isEditing && setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2"
        >
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: category.color || "var(--primary)" }}
          />
          <svg
            className={`w-4 h-4 text-[var(--muted)] transition-transform flex-shrink-0 ${
              isCollapsed ? "-rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isEditing ? (
          <input
            ref={inputRef}
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleSaveName}
            onKeyDown={handleKeyDown}
            className="text-lg font-semibold bg-transparent border-b border-[var(--primary)] outline-none min-w-0"
            style={{ width: `${Math.max(editName.length, 4)}ch` }}
          />
        ) : (
          <h2 className="text-lg font-semibold">{category.name}</h2>
        )}

        <span className="text-sm text-[var(--muted)]">({links.length})</span>

        {!isEditing && onRenameCategory && (
          <button
            onClick={handleStartEdit}
            className="opacity-0 group-hover/header:opacity-100 transition-opacity text-[var(--muted)] hover:text-[var(--foreground)] ml-1"
            title="카테고리 이름 변경"
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2l2 2-7 7H3v-2l7-7z" />
              <path d="M8.5 3.5l2 2" />
            </svg>
          </button>
        )}
      </div>

      {!isCollapsed && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedLinks.map((link) => (
            <LinkCard
              key={link.id}
              link={link}
              onEdit={onEditLink}
              onDelete={onDeleteLink}
              onTogglePin={onTogglePin}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
