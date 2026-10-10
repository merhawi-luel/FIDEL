"use client";

export type Progress = {
  stars: number;
  learned: Record<string, number>; // english word -> stars earned
  unlocked: number; // highest unlocked level (1-based)
  stickers: string[];
  familiesDone: string[]; // completed family bases
};

const KEY = "fidel-word-garden-progress-v1";

export const EMPTY_PROGRESS: Progress = {
  stars: 0,
  learned: {},
  unlocked: 1,
  stickers: [],
  familiesDone: [],
};

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...EMPTY_PROGRESS };
    const p = JSON.parse(raw) as Progress;
    return { ...EMPTY_PROGRESS, ...p };
  } catch {
    return { ...EMPTY_PROGRESS };
  }
}

export function saveProgress(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // storage may be unavailable — progress just won't persist
  }
}
