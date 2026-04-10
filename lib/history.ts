import { AnnotationResult } from "@/lib/annotate";

const STORAGE_KEY = "counselor_history";
const MAX_ITEMS = 20;

export type HistoryItem = {
  id: string;
  essay: string;
  result: AnnotationResult;
  createdAt: string;
};

export function saveAnnotation(essay: string, result: AnnotationResult): void {
  try {
    const history = getHistory();
    const item: HistoryItem = {
      id: Date.now().toString(),
      essay,
      result,
      createdAt: new Date().toISOString(),
    };
    const updated = [item, ...history].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // never crash
  }
}

export function getHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryItem[];
  } catch {
    return [];
  }
}

export function deleteHistoryItem(id: string): void {
  try {
    const history = getHistory();
    const updated = history.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // never crash
  }
}
