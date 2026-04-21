"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "@/types";
import LinkCard from "./LinkCard";

interface SortableLinkCardProps {
  link: Link;
  onEdit?: (link: Link) => void;
  onDelete?: (id: string) => void;
  onTogglePin?: (id: string, isPinned: boolean) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
}

export default function SortableLinkCard({
  link,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleFavorite,
}: SortableLinkCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="relative">
        {/* Drag Handle */}
        <div
          {...listeners}
          className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing z-10 opacity-0 hover:opacity-100 transition-opacity"
        >
          <svg
            className="w-5 h-5 text-[var(--muted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>
        <LinkCard
          link={link}
          onEdit={onEdit}
          onDelete={onDelete}
          onTogglePin={onTogglePin}
          onToggleFavorite={onToggleFavorite}
        />
      </div>
    </div>
  );
}
