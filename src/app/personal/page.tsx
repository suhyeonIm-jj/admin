"use client";

import { useState, useEffect, useCallback } from "react";
import { Link, Category, Tag } from "@/types";
import LinkCard from "@/components/LinkCard";
import CategorySection from "@/components/CategorySection";
import SearchBar from "@/components/SearchBar";
import TagFilter from "@/components/TagFilter";
import LinkModal from "@/components/LinkModal";
import SortableSection from "@/components/SortableSection";

export default function PersonalPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [linksRes, categoriesRes, tagsRes] = await Promise.all([
        fetch("/api/links?type=personal"),
        fetch("/api/categories?type=personal"),
        fetch("/api/tags"),
      ]);

      const [linksData, categoriesData, tagsData] = await Promise.all([
        linksRes.json(),
        categoriesRes.json(),
        tagsRes.json(),
      ]);

      setLinks(linksData);
      setCategories(categoriesData);
      setTags(tagsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      searchQuery === "" ||
      link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some((tag) => link.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const favoriteLinks = filteredLinks
    .filter((link) => link.isFavorite)
    .sort((a, b) => a.order - b.order);
  const recentLinks = [...filteredLinks]
    .filter((link) => !link.isFavorite)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const handleReorder = async (orderedIds: string[]) => {
    try {
      await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder", orderedIds }),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to reorder links:", error);
    }
  };

  const handleTogglePin = async (id: string, isPinned: boolean) => {
    try {
      await fetch(`/api/links/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned }),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to toggle pin:", error);
    }
  };

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      await fetch(`/api/links/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite }),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await fetch(`/api/links/${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Failed to delete link:", error);
    }
  };

  const handleSaveLink = async (data: Partial<Link>) => {
    try {
      if (editingLink) {
        await fetch(`/api/links/${editingLink.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        await fetch("/api/links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      }
      fetchData();
      setEditingLink(null);
    } catch (error) {
      console.error("Failed to save link:", error);
    }
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const toggleTag = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  // Get unique tags from personal links
  const personalTags = tags.filter((tag) =>
    links.some((link) => link.tags.includes(tag.name))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Personal Links</h1>
        <button
          onClick={() => {
            setEditingLink(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg font-medium hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Bookmark
        </button>
      </div>

      {/* Search & Filter */}
      <div className="space-y-4 mb-8">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search personal links..."
        />
        <TagFilter
          tags={personalTags}
          selectedTags={selectedTags}
          onToggleTag={toggleTag}
          onClearAll={() => setSelectedTags([])}
        />
      </div>

      {/* Favorites (Sortable) */}
      {favoriteLinks.length > 0 && (
        <SortableSection
          title="Favorites"
          icon="❤️"
          links={favoriteLinks}
          onReorder={handleReorder}
          onEdit={handleEditLink}
          onDelete={handleDeleteLink}
          onTogglePin={handleTogglePin}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Recently Updated */}
      {recentLinks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🕐</span> Recently Updated
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onEdit={handleEditLink}
                onDelete={handleDeleteLink}
                onTogglePin={handleTogglePin}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div>
        <h2 className="text-lg font-semibold mb-4">By Category</h2>
        {categories.map((category) => {
          const categoryLinks = filteredLinks.filter(
            (link) => link.category === category.id && !link.isFavorite
          );
          return (
            <CategorySection
              key={category.id}
              category={category}
              links={categoryLinks}
              onEditLink={handleEditLink}
              onDeleteLink={handleDeleteLink}
              onTogglePin={handleTogglePin}
              onToggleFavorite={handleToggleFavorite}
            />
          );
        })}
      </div>

      {/* Empty State */}
      {filteredLinks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--muted)] mb-4">
            {searchQuery || selectedTags.length > 0
              ? "No bookmarks match your search."
              : "No personal bookmarks yet."}
          </p>
          <button
            onClick={() => {
              setEditingLink(null);
              setIsModalOpen(true);
            }}
            className="text-[var(--primary)] hover:underline"
          >
            Add your first bookmark
          </button>
        </div>
      )}

      {/* Modal */}
      <LinkModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLink(null);
        }}
        onSave={handleSaveLink}
        link={editingLink}
        categories={categories}
        tags={tags}
        defaultCategory={categories[0]?.id}
      />
    </div>
  );
}
