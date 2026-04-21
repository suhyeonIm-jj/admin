"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Link } from "@/types";
import SortableLinkCard from "./SortableLinkCard";

interface SortableSectionProps {
  title: string;
  icon?: string;
  links: Link[];
  onReorder: (orderedIds: string[]) => void;
  onEdit?: (link: Link) => void;
  onDelete?: (id: string) => void;
  onTogglePin?: (id: string, isPinned: boolean) => void;
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
}

export default function SortableSection({
  title,
  icon,
  links,
  onReorder,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleFavorite,
}: SortableSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = links.findIndex((link) => link.id === active.id);
      const newIndex = links.findIndex((link) => link.id === over.id);
      const newOrder = arrayMove(links, oldIndex, newIndex);
      onReorder(newOrder.map((link) => link.id));
    }
  };

  if (links.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
        <span className="text-sm font-normal text-[var(--muted)]">
          (drag to reorder)
        </span>
      </h2>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={links.map((l) => l.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {links.map((link) => (
              <SortableLinkCard
                key={link.id}
                link={link}
                onEdit={onEdit}
                onDelete={onDelete}
                onTogglePin={onTogglePin}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
