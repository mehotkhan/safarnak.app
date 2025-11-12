import type { Env } from '../types';

type TimeWindow = 'M5' | 'H1' | 'D1';

const WINDOWS: TimeWindow[] = ['M5', 'H1', 'D1'];

interface TrendingItem {
  key: string;
  label: string;
  score: number;
  updatedAt: number;
}

interface TrendingList {
  items: TrendingItem[];
  window: TimeWindow;
}

async function updateTopList(env: Env, kind: 'entity' | 'topic', window: TimeWindow, key: string, label: string, delta = 1): Promise<void> {
  const kvKey = `top:${kind}:${window}`;
  const current = await env.KV.get(kvKey, 'json') as TrendingList | null;
  const now = Date.now();
  const items = current?.items ?? [];
  const idx = items.findIndex((i) => i.key === key);
  if (idx >= 0) {
    items[idx] = { ...items[idx], score: (items[idx].score || 0) + delta, updatedAt: now, label };
  } else {
    items.push({ key, label, score: delta, updatedAt: now });
  }
  // keep top 100 to bound size
  items.sort((a, b) => b.score - a.score);
  const trimmed = items.slice(0, 100);
  await env.KV.put(kvKey, JSON.stringify({ window, items: trimmed }));
}

export async function incrementTrendingEntity(env: Env, entityType: string): Promise<void> {
  for (const w of WINDOWS) {
    await updateTopList(env, 'entity', w, entityType, entityType, 1);
  }
}

export async function incrementTrendingTopic(env: Env, topic: string): Promise<void> {
  const key = topic.toLowerCase();
  const label = topic;
  for (const w of WINDOWS) {
    await updateTopList(env, 'topic', w, key, label, 1);
  }
}

export async function readTopList(env: Env, kind: 'entity' | 'topic', window: TimeWindow, limit: number): Promise<Array<{ key: string; label: string; score: number }>> {
  const kvKey = `top:${kind}:${window}`;
  const current = (await env.KV.get(kvKey, 'json')) as TrendingList | null;
  if (!current || !Array.isArray(current.items)) return [];
  const items = current.items.slice(0, limit).map((i) => ({ key: i.key, label: i.label, score: i.score }));
  return items;
}


