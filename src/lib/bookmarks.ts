export interface SavedArticle {
  article_id: number;
  title: string;
  slug: string;
  content: string;
  author: string;
  tags?: string[];
}

const BOOKMARK_STORAGE_PREFIX = "pivot_bookmarks_";
const LIKE_STORAGE_PREFIX = "pivot_likes_";
const LIKED_ARTICLES_STORAGE_PREFIX = "pivot_liked_articles_";

function getStorageKey(prefix: string, userId: number | string) {
  return `${prefix}${userId}`;
}

function safeParse<T>(value: string | null): T | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error("Failed to parse local storage value:", error);
    return null;
  }
}

function readStorage<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }
  return safeParse<T>(window.localStorage.getItem(key));
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function normalizeSavedArticle(item: unknown): SavedArticle | null {
  if (typeof item !== "object" || item === null) {
    return null;
  }

  const record = item as Record<string, unknown>;
  const slug = typeof record.slug === "string" ? record.slug : "";
  const title = typeof record.title === "string" ? record.title : "";
  const content = typeof record.content === "string" ? record.content : "";
  const author = typeof record.author === "string" ? record.author : "";
  const article_id = typeof record.article_id === "number" ? record.article_id : typeof record.id === "number" ? record.id : 0;
  const tags = Array.isArray(record.tags)
    ? record.tags.filter((tag): tag is string => typeof tag === "string")
    : ["General"];

  if (!slug || !title) {
    return null;
  }

  return { article_id, title, slug, content, author, tags };
}

export function loadSavedArticles(userId: number | string): SavedArticle[] {
  const stored = readStorage<unknown[]>(getStorageKey(BOOKMARK_STORAGE_PREFIX, userId));
  if (!Array.isArray(stored)) {
    return [];
  }

  return stored
    .map(normalizeSavedArticle)
    .filter((item): item is SavedArticle => item !== null);
}

export function saveSavedArticles(userId: number | string, articles: SavedArticle[]) {
  writeStorage(getStorageKey(BOOKMARK_STORAGE_PREFIX, userId), articles);
}

export function loadLikedArticles(userId: number | string): SavedArticle[] {
  const stored = readStorage<unknown[]>(getStorageKey(LIKED_ARTICLES_STORAGE_PREFIX, userId));
  if (!Array.isArray(stored)) {
    return [];
  }

  return stored
    .map(normalizeSavedArticle)
    .filter((item): item is SavedArticle => item !== null);
}

export function saveLikedArticles(userId: number | string, articles: SavedArticle[]) {
  writeStorage(getStorageKey(LIKED_ARTICLES_STORAGE_PREFIX, userId), articles);
}

export function loadLikedArticleIds(userId: number | string): number[] {
  return readStorage<number[]>(getStorageKey(LIKE_STORAGE_PREFIX, userId)) ?? [];
}

export function saveLikedArticleIds(userId: number | string, ids: number[]) {
  writeStorage(getStorageKey(LIKE_STORAGE_PREFIX, userId), ids);
}
