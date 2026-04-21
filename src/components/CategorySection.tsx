"use client";

import { Link, Category } from "@/types";
import LinkCard from "./LinkCard";
import { useState } from "react";

interface CategorySectionProps {
  category: Category;
  links: Link[];
  onEditLink?: (link: Link) => void;
  onDeleteLink?: (id: string) => void;
  onTogglePin?: (id: string, isPinned: boolean) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
}

export default function CategorySection({
  category,
  links,
  onEditLink,
  onDeleteLink,
  onTogglePin,
  onToggleFavorite,
}: CategorySectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sortedLinks = [...links].sort((a, b) => a.order - b.order);

  if (links.length === 0) return null;

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="flex items-center gap-2 mb-4 group"
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: category.color || "var(--primary)" }}
        />
        <h2 className="text-lg font-semibold">{category.name}</h2>
        <span className="text-sm text-[var(--muted)]">({links.length})</span>
        <svg
          className={`w-4 h-4 text-[var(--muted)] transition-transform ${
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
