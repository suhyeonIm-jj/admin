"use client";

import { Link, Category, Tag } from "@/types";
import { useState, useEffect, useCallback } from "react";

interface LinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Link>) => void;
  link?: Link | null;
  categories: Category[];
  tags: Tag[];
  defaultCategory?: string;
}

export default function LinkModal({
  isOpen,
  onClose,
  onSave,
  link,
  categories,
  tags,
  defaultCategory,
}: LinkModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    favicon: "",
    description: "",
    memo: "",
    category: defaultCategory || "",
    tags: [] as string[],
    isPinned: false,
    isFavorite: false,
  });
  const [faviconLoading, setFaviconLoading] = useState(false);

  useEffect(() => {
    if (link) {
      setFormData({
        title: link.title,
        url: link.url,
        favicon: link.favicon || "",
        description: link.description || "",
        memo: link.memo || "",
        category: link.category,
        tags: link.tags,
        isPinned: link.isPinned,
        isFavorite: link.isFavorite,
      });
    } else {
      setFormData({
        title: "",
        url: "",
        favicon: "",
        description: "",
        memo: "",
        category: defaultCategory || categories[0]?.id || "",
        tags: [],
        isPinned: false,
        isFavorite: false,
      });
    }
  }, [link, defaultCategory, categories]);

  const fetchFavicon = useCallback(async (url: string) => {
    if (!url) return;

    try {
      setFaviconLoading(true);
      const res = await fetch(`/api/favicon?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, favicon: data.favicon }));
      }
    } catch (error) {
      console.error("Failed to fetch favicon:", error);
    } finally {
      setFaviconLoading(false);
    }
  }, []);

  const handleUrlBlur = () => {
    if (formData.url && !formData.favicon) {
      fetchFavicon(formData.url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const toggleTag = (tagName: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagName)
        ? prev.tags.filter((t) => t !== tagName)
        : [...prev.tags, tagName],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      <div className="relative bg-[var(--card-bg)] rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-[var(--card-border)]">
          <h2 className="text-lg font-semibold">
            {link ? "Edit Link" : "Add Link"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--card-border)] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">URL *</label>
            <div className="flex gap-2">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                {faviconLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--primary)]" />
                ) : formData.favicon ? (
                  <img
                    src={formData.favicon}
                    alt=""
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-[var(--muted)] text-xs">Icon</span>
                )}
              </div>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                onBlur={handleUrlBlur}
                required
                className="flex-1 px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="Enter title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              placeholder="Brief description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Memo</label>
            <textarea
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--card-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
              placeholder="Personal notes (visible on hover)..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.name)}
                  className={`px-3 py-1 text-sm rounded-full transition-all ${
                    formData.tags.includes(tag.name)
                      ? "bg-[var(--primary)] text-white"
                      : "bg-[var(--background)] border border-[var(--card-border)]"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPinned}
                onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                className="w-4 h-4 rounded border-[var(--card-border)]"
              />
              <span className="text-sm">Pin to top</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFavorite}
                onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
                className="w-4 h-4 rounded border-[var(--card-border)]"
              />
              <span className="text-sm">Add to favorites</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[var(--card-border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-[var(--card-border)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
            >
              {link ? "Save Changes" : "Add Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
