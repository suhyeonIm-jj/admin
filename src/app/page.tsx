"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Link, Category, Tag } from "@/types";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import ContentFilter from "@/components/ContentFilter";
import CommandPalette from "@/components/CommandPalette";
import LinkModal from "@/components/LinkModal";
import SortableLinkCard from "@/components/SortableLinkCard";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

type ViewMode = "card" | "list" | "compact";

interface UserInfo {
  id: string;
  email: string;
  name: string;
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [workspace, setWorkspace] = useState<"work" | "personal">("work");
  const [activeCategory, setActiveCategory] = useState("all");
  const [view, setView] = useState<ViewMode>("card");
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  const [links, setLinks] = useState<Link[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [workCount, setWorkCount] = useState(0);
  const [personalCount, setPersonalCount] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch {
        router.push("/login");
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const fetchData = useCallback(async () => {
    try {
      const [linksRes, categoriesRes, tagsRes, workRes, personalRes] = await Promise.all([
        fetch(`/api/links?type=${workspace}`),
        fetch(`/api/categories?type=${workspace}`),
        fetch("/api/tags"),
        fetch("/api/links?type=work"),
        fetch("/api/links?type=personal"),
      ]);

      const [linksData, categoriesData, tagsData, workData, personalData] = await Promise.all([
        linksRes.json(),
        categoriesRes.json(),
        tagsRes.json(),
        workRes.json(),
        personalRes.json(),
      ]);

      setLinks(linksData);
      setCategories(categoriesData);
      setTags(tagsData);
      setWorkCount(workData.length);
      setPersonalCount(personalData.length);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [workspace]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [fetchData, user]);

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Reset filters on workspace switch
  useEffect(() => {
    setActiveCategory("all");
    setSelectedTags([]);
  }, [workspace]);

  // Filter links based on active category + selected tags
  const filteredLinks = links.filter((link) => {
    const catOk = (() => {
      if (activeCategory === "all") return true;
      if (activeCategory === "pinned") return link.isFavorite || link.isPinned;
      if (activeCategory === "recent") return !!link.lastVisited;
      return link.category === activeCategory;
    })();
    const tagOk =
      selectedTags.length === 0 ||
      selectedTags.every((t) => link.tags.includes(t));
    return catOk && tagOk;
  });

  // Sort links
  const displayLinks = [...filteredLinks].sort((a, b) => {
    if (activeCategory === "recent") {
      return new Date(b.lastVisited!).getTime() - new Date(a.lastVisited!).getTime();
    }
    return a.order - b.order;
  });

  // Count calculations
  const counts = {
    work: workCount,
    personal: personalCount,
    total: links.length,
    pinned: links.filter((l) => l.isFavorite || l.isPinned).length,
    recent: links.filter((l) => !!l.lastVisited).length,
  };

  // Categories with counts
  const categoriesWithCounts = categories.map((cat) => ({
    ...cat,
    count: links.filter((l) => l.category === cat.id).length,
  }));

  // Unique tags from links
  const uniqueTags = [...new Set(links.flatMap((l) => l.tags))];

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
    setLinks((prev) => prev.filter((link) => link.id !== id));
    try {
      const res = await fetch(`/api/links/${id}`, { method: "DELETE" });
      if (!res.ok) fetchData();
    } catch (error) {
      console.error("Failed to delete link:", error);
      fetchData();
    }
  };

  const handleRenameCategory = async (id: string, name: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, name } : cat))
    );
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) fetchData();
    } catch (error) {
      console.error("Failed to rename category:", error);
      fetchData();
    }
  };

  const handleDeleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    setLinks((prev) => prev.filter((link) => link.category !== id));
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) fetchData();
    } catch (error) {
      console.error("Failed to delete category:", error);
      fetchData();
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = displayLinks.findIndex((l) => l.id === active.id);
    const newIndex = displayLinks.findIndex((l) => l.id === over.id);
    const reordered = arrayMove([...displayLinks], oldIndex, newIndex);
    const orderedIds = reordered.map((l) => l.id);

    setLinks((prev) => {
      const updated = prev.map((link) => {
        const idx = orderedIds.indexOf(link.id);
        return idx !== -1 ? { ...link, order: idx } : link;
      });
      return updated;
    });

    try {
      await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reorder", orderedIds }),
      });
    } catch {
      fetchData();
    }
  };

  const handleAddCategory = async (name: string) => {
    try {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type: workspace,
          order: categories.length,
          color: "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0"),
        }),
      });
      fetchData();
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  const handleEditLink = (link: Link) => {
    setEditingLink(link);
    setIsModalOpen(true);
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

  const getCategoryForLink = (link: Link) => {
    return categories.find((c) => c.id === link.category);
  };

  // Get section title based on active category
  const getSectionTitle = () => {
    if (activeCategory === "all") return "전체 링크";
    if (activeCategory === "pinned") return "즐겨찾기";
    if (activeCategory === "recent") return "최근 방문";
    const cat = categories.find((c) => c.id === activeCategory);
    return cat?.name || "링크";
  };

  // Show loading while checking auth
  if (isAuthLoading) {
    return (
      <div className="auth-page">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar
        workspace={workspace}
        setWorkspace={setWorkspace}
        workCount={counts.work}
        personalCount={counts.personal}
        user={user}
        onLogout={handleLogout}
      />

      <main className="main">
        <Topbar
          workspace={workspace}
          view={view}
          setView={setView}
          onAdd={() => {
            setEditingLink(null);
            setIsModalOpen(true);
          }}
          onOpenCommand={() => setIsCommandOpen(true)}
        />

        <ContentFilter
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          categories={categoriesWithCounts}
          counts={{
            total: counts.total,
            pinned: counts.pinned,
            recent: counts.recent,
          }}
          tags={uniqueTags}
          selectedTags={selectedTags}
          onToggleTag={handleToggleTag}
          onRenameCategory={handleRenameCategory}
          onDeleteCategory={handleDeleteCategory}
          onAddCategory={handleAddCategory}
        />

        <div className="content">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]" />
            </div>
          ) : (
            <>
              {/* Section */}
              <div className="section">
                <div className="section-header">
                  <div className="section-title">
                    {activeCategory === "pinned" && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="pin-icon">
                        <path d="M7 1.5l1.7 3.55 3.9.48-2.88 2.68.74 3.85L7 10.24 3.54 12.06l.74-3.85L1.4 5.53l3.9-.48L7 1.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                      </svg>
                    )}
                    {getSectionTitle()}
                    <span className="count">{displayLinks.length}</span>
                  </div>
                </div>

                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={displayLinks.map((l) => l.id)}
                    strategy={view === "list" ? verticalListSortingStrategy : rectSortingStrategy}
                  >
                    {view === "card" && (
                      <div className="grid">
                        {displayLinks.map((link) => (
                          <SortableLinkCard
                            key={link.id}
                            link={link}
                            view="card"
                            category={getCategoryForLink(link)}
                            onToggleFavorite={handleToggleFavorite}
                            onEdit={handleEditLink}
                            onDelete={handleDeleteLink}
                          />
                        ))}
                      </div>
                    )}

                    {view === "list" && (
                      <div className="list">
                        <div className="list-header">
                          <span></span>
                          <span></span>
                          <span>제목</span>
                          <span>태그</span>
                          <span>카테고리</span>
                          <span></span>
                        </div>
                        {displayLinks.map((link) => (
                          <SortableLinkCard
                            key={link.id}
                            link={link}
                            view="list"
                            category={getCategoryForLink(link)}
                            onToggleFavorite={handleToggleFavorite}
                            onEdit={handleEditLink}
                            onDelete={handleDeleteLink}
                          />
                        ))}
                      </div>
                    )}

                    {view === "compact" && (
                      <div className="compact-grid">
                        {displayLinks.map((link) => (
                          <SortableLinkCard
                            key={link.id}
                            link={link}
                            view="compact"
                            category={getCategoryForLink(link)}
                            onToggleFavorite={handleToggleFavorite}
                            onEdit={handleEditLink}
                            onDelete={handleDeleteLink}
                          />
                        ))}
                      </div>
                    )}
                  </SortableContext>
                </DndContext>

                {displayLinks.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-[var(--fg-muted)]">
                      {activeCategory === "pinned"
                        ? "즐겨찾기한 링크가 없습니다."
                        : "링크가 없습니다."}
                    </p>
                    <button
                      onClick={() => {
                        setEditingLink(null);
                        setIsModalOpen(true);
                      }}
                      className="mt-4 text-[var(--accent)] hover:underline"
                    >
                      첫 번째 링크 추가하기
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Command Palette */}
      <CommandPalette
        open={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        links={links}
        categories={categories}
      />

      {/* Add/Edit Modal */}
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
