export interface Link {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  description?: string;
  memo?: string;
  tags: string[];
  category: string;
  isPinned: boolean;
  isFavorite: boolean;
  usageCount: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: "work" | "personal";
  order: number;
  color?: string;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export type PageType = "work" | "personal";
