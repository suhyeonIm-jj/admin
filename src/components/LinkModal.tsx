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
    <div className="modal-overlay">
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {link ? "링크 수정" : "링크 추가"}
          </h2>
          <button onClick={onClose} className="modal-close">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M4 4l10 10M14 4L4 14" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-field">
            <label>URL *</label>
            <div className="url-input-group">
              <div className="favicon-preview">
                {faviconLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--accent)]" />
                ) : formData.favicon ? (
                  <img
                    src={formData.favicon}
                    alt=""
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span>?</span>
                )}
              </div>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                onBlur={handleUrlBlur}
                required
                className="input"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div className="form-field">
            <label>제목 *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="input"
              placeholder="링크 제목을 입력하세요"
            />
          </div>

          <div className="form-field">
            <label>카테고리 *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              className="input"
            >
              <option value="">카테고리 선택</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>설명</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              placeholder="간단한 설명"
            />
          </div>

          <div className="form-field">
            <label>메모</label>
            <textarea
              value={formData.memo}
              onChange={(e) => setFormData({ ...formData, memo: e.target.value })}
              rows={3}
              className="input"
              placeholder="개인 메모..."
            />
          </div>

          <div className="form-field">
            <label>태그</label>
            <div className="tag-select">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.name)}
                  className={`tag-option ${formData.tags.includes(tag.name) ? "selected" : ""}`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <div className="form-field checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.isPinned}
                onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
              />
              <span>상단 고정</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={formData.isFavorite}
                onChange={(e) => setFormData({ ...formData, isFavorite: e.target.checked })}
              />
              <span>즐겨찾기 추가</span>
            </label>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-ghost">
              취소
            </button>
            <button type="submit" className="btn-primary">
              {link ? "저장" : "추가"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
