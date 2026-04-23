"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link, Category } from "@/types";
import LinkCard from "./LinkCard";

interface SortableLinkCardProps {
  link: Link;
  view?: "card" | "list" | "compact";
  category?: Category;
  onEdit?: (link: Link) => void;
  onDelete?: (id: string) => void;
  onTogglePin?: (id: string, isPinned: boolean) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
}

export default function SortableLinkCard({
  link,
  view = "card",
  category,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleFavorite,
}: SortableLinkCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: link.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      {...attributes}
      {...listeners}
    >
      <LinkCard
        link={link}
        view={view}
        category={category}
        onEdit={onEdit}
        onDelete={onDelete}
        onTogglePin={onTogglePin}
        onToggleFavorite={onToggleFavorite}
      />
    </div>
  );
}
