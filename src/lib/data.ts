import fs from "fs";
import path from "path";
import { Link, Category, Tag } from "@/types";

const dataDir = path.join(process.cwd(), "data");

function readJson<T>(filename: string): T {
  const filePath = path.join(dataDir, filename);
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data) as T;
}

function writeJson<T>(filename: string, data: T): void {
  const filePath = path.join(dataDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// Links
export function getLinks(): Link[] {
  return readJson<Link[]>("links.json");
}

export function getLinksByType(type: "work" | "personal"): Link[] {
  const links = getLinks();
  const categories = getCategories();
  const categoryIds = categories
    .filter((c) => c.type === type)
    .map((c) => c.id);
  return links.filter((link) => categoryIds.includes(link.category));
}

export function getLinkById(id: string): Link | undefined {
  const links = getLinks();
  return links.find((link) => link.id === id);
}

export function createLink(link: Omit<Link, "id" | "createdAt" | "updatedAt">): Link {
  const links = getLinks();
  const maxOrder = links.length > 0 ? Math.max(...links.map((l) => l.order)) : -1;
  const newLink: Link = {
    ...link,
    id: `link-${Date.now()}`,
    order: maxOrder + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  links.push(newLink);
  writeJson("links.json", links);
  return newLink;
}

export function updateLink(id: string, updates: Partial<Link>): Link | null {
  const links = getLinks();
  const index = links.findIndex((link) => link.id === id);
  if (index === -1) return null;

  links[index] = {
    ...links[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeJson("links.json", links);
  return links[index];
}

export function deleteLink(id: string): boolean {
  const links = getLinks();
  const filtered = links.filter((link) => link.id !== id);
  if (filtered.length === links.length) return false;
  writeJson("links.json", filtered);
  return true;
}

export function incrementUsageCount(id: string): Link | null {
  const links = getLinks();
  const index = links.findIndex((link) => link.id === id);
  if (index === -1) return null;

  const now = new Date().toISOString();
  links[index].usageCount += 1;
  links[index].lastVisited = now;
  links[index].updatedAt = now;
  writeJson("links.json", links);
  return links[index];
}

export function reorderLinks(orderedIds: string[]): void {
  const links = getLinks();
  orderedIds.forEach((id, index) => {
    const link = links.find((l) => l.id === id);
    if (link) {
      link.order = index;
    }
  });
  writeJson("links.json", links);
}

// Categories
export function getCategories(): Category[] {
  return readJson<Category[]>("categories.json");
}

export function getCategoriesByType(type: "work" | "personal"): Category[] {
  const categories = getCategories();
  return categories.filter((c) => c.type === type).sort((a, b) => a.order - b.order);
}

export function createCategory(category: Omit<Category, "id">): Category {
  const categories = getCategories();
  const newCategory: Category = {
    ...category,
    id: `cat-${Date.now()}`,
  };
  categories.push(newCategory);
  writeJson("categories.json", categories);
  return newCategory;
}

export function updateCategory(id: string, updates: Partial<Category>): Category | null {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index === -1) return null;

  categories[index] = { ...categories[index], ...updates };
  writeJson("categories.json", categories);
  return categories[index];
}

export function reorderCategories(orderedIds: string[]): void {
  const categories = getCategories();
  orderedIds.forEach((id, index) => {
    const cat = categories.find((c) => c.id === id);
    if (cat) cat.order = index;
  });
  writeJson("categories.json", categories);
}

export function deleteCategory(id: string): boolean {
  const categories = getCategories();
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length === categories.length) return false;
  writeJson("categories.json", filtered);

  const links = getLinks();
  writeJson("links.json", links.filter((l) => l.category !== id));
  return true;
}

// Tags
export function getTags(): Tag[] {
  return readJson<Tag[]>("tags.json");
}

export function createTag(tag: Omit<Tag, "id">): Tag {
  const tags = getTags();
  const newTag: Tag = {
    ...tag,
    id: `tag-${Date.now()}`,
  };
  tags.push(newTag);
  writeJson("tags.json", tags);
  return newTag;
}

export function deleteTag(id: string): boolean {
  const tags = getTags();
  const filtered = tags.filter((t) => t.id !== id);
  if (filtered.length === tags.length) return false;
  writeJson("tags.json", filtered);
  return true;
}
