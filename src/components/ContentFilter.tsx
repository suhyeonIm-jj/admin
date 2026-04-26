"use client";

import { Category } from "@/types";
import { useState, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CategoryWithCount extends Category {
  count?: number;
}

interface ContentFilterProps {
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  categories: CategoryWithCount[];
  tags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onRenameCategory?: (id: string, name: string) => void;
  onDeleteCategory?: (id: string) => void;
  onAddCategory?: (name: string) => void;
  onReorderCategories?: (orderedIds: string[]) => void;
}

/* ── Sortable chip ── */

interface SortableCatChipProps {
  cat: CategoryWithCount;
  isSelected: boolean;
  onSelect: () => void;
  isEditing: boolean;
  editInputRef: React.RefObject<HTMLInputElement | null>;
  editingName: string;
  onEditingNameChange: (name: string) => void;
  onSaveRename: () => void;
  onRenameKeyDown: (e: React.KeyboardEvent) => void;
  onStartRename: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  canRename: boolean;
  canDelete: boolean;
}

function SortableCatChip({
  cat,
  isSelected,
  onSelect,
  isEditing,
  editInputRef,
  editingName,
  onEditingNameChange,
  onSaveRename,
  onRenameKeyDown,
  onStartRename,
  onDelete,
  canRename,
  canDelete,
}: SortableCatChipProps) {
  const [isHovered, setIsHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cat.id, disabled: isEditing });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        cursor: isDragging ? "grabbing" : undefined,
      }}
      className={`cat-chip ${isSelected ? "active" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !isEditing && onSelect()}
      {...attributes}
      {...listeners}
    >
      <span className="chip-dot" style={{ background: cat.color }} />

      {isEditing ? (
        <input
          ref={editInputRef}
          value={editingName}
          onChange={(e) => onEditingNameChange(e.target.value)}
          onBlur={onSaveRename}
          onKeyDown={onRenameKeyDown}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="chip-edit-input"
        />
      ) : (
        <>
          <span className="chip-name">{cat.name}</span>
          <span className="chip-count">{cat.count || 0}</span>
        </>
      )}

      {!isEditing && (
        <span
          className="chip-actions"
          style={{
            opacity: isHovered ? 1 : 0,
            pointerEvents: isHovered ? "auto" : "none",
            transition: "opacity 0.12s",
          }}
        >
          {canRename && (
            <button
              className="chip-action-btn"
              onClick={onStartRename}
              onPointerDown={(e) => e.stopPropagation()}
              title="이름 변경"
            >
              <IconEdit />
            </button>
          )}
          {canDelete && (
            <button
              className="chip-action-btn del"
              onClick={onDelete}
              onPointerDown={(e) => e.stopPropagation()}
              title="삭제"
            >
              <IconTrash />
            </button>
          )}
        </span>
      )}
    </div>
  );
}

/* ── ContentFilter ── */

export default function ContentFilter({
  selectedCategory,
  setSelectedCategory,
  categories,
  tags,
  selectedTags,
  onToggleTag,
  onRenameCategory,
  onDeleteCategory,
  onAddCategory,
  onReorderCategories,
}: ContentFilterProps) {
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

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

  const handleCatDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    const reordered = arrayMove([...categories], oldIndex, newIndex);
    onReorderCategories?.(reordered.map((c) => c.id));
  };

  const startAddCategory = () => {
    setIsAddingCat(true);
    setNewCatName("");
    setTimeout(() => addInputRef.current?.focus(), 0);
  };

  const saveAddCategory = () => {
    const trimmed = newCatName.trim();
    if (trimmed) onAddCategory?.(trimmed);
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

  if (categories.length === 0 && tags.length === 0) return null;

  return (
    <div className="content-filter">
      {/* Row 1: category chips (sortable) */}
      {categories.length > 0 && (
        <div className="filter-row">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleCatDragEnd}
          >
            <SortableContext
              items={categories.map((c) => c.id)}
              strategy={rectSortingStrategy}
            >
              {categories.map((cat) => (
                <SortableCatChip
                  key={cat.id}
                  cat={cat}
                  isSelected={selectedCategory === cat.id}
                  onSelect={() =>
                    setSelectedCategory(
                      selectedCategory === cat.id ? null : cat.id
                    )
                  }
                  isEditing={editingCatId === cat.id}
                  editInputRef={editInputRef}
                  editingName={editingName}
                  onEditingNameChange={setEditingName}
                  onSaveRename={() => saveRename(cat)}
                  onRenameKeyDown={(e) => handleRenameKeyDown(e, cat)}
                  onStartRename={(e) => startRename(e, cat)}
                  onDelete={(e) => handleDelete(e, cat)}
                  canRename={!!onRenameCategory}
                  canDelete={!!onDeleteCategory}
                />
              ))}
            </SortableContext>
          </DndContext>

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
      )}

      {/* Row 2: tag chips */}
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
