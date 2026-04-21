"use client";

import { Tag } from "@/types";

interface TagFilterProps {
  tags: Tag[];
  selectedTags: string[];
  onToggleTag: (tagName: string) => void;
  onClearAll?: () => void;
}

export default function TagFilter({
  tags,
  selectedTags,
  onToggleTag,
  onClearAll,
}: TagFilterProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-[var(--muted)]">Tags:</span>
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag.name);
        return (
          <button
            key={tag.id}
            onClick={() => onToggleTag(tag.name)}
            className={`px-3 py-1 text-sm rounded-full transition-all ${
              isSelected
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--primary)]"
            }`}
            style={
              isSelected
                ? { backgroundColor: tag.color || "var(--primary)" }
                : {}
            }
          >
            {tag.name}
          </button>
        );
      })}
      {selectedTags.length > 0 && onClearAll && (
        <button
          onClick={onClearAll}
          className="px-3 py-1 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
