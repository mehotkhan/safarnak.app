export class TrendingRollup {
  state: DurableObjectState;
  env: Env;
  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    if (request.method === 'POST' && path === '/compact') {
      await this.compact();
      return new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
    }
    return new Response('Not Found', { status: 404 });
  }

  private async compact(): Promise<void> {
    // Decay and trim top lists to keep them fresh and bounded
    const windows: Array<'M5' | 'H1' | 'D1'> = ['M5', 'H1', 'D1'];
    const kinds: Array<'entity' | 'topic'> = ['entity', 'topic'];
    const now = Date.now();
    const halfLives: Record<string, number> = {
      M5: 2 * 60 * 1000, // 2m half-life within 5m window
      H1: 15 * 60 * 1000, // 15m half-life
      D1: 3 * 60 * 60 * 1000, // 3h half-life
    };
    for (const w of windows) {
      for (const k of kinds) {
        const key = `top:${k}:${w}`;
        const json = (await this.env.KV.get(key, 'json')) as any;
        if (!json || !Array.isArray(json.items)) continue;
        const t = halfLives[w] ?? 15 * 60 * 1000;
        const decayed = json.items.map((it: any) => {
          const age = Math.max(0, now - (it.updatedAt || now));
          const decay = Math.pow(0.5, age / t);
          return { ...it, score: (it.score || 0) * decay, updatedAt: now };
        });
        decayed.sort((a: any, b: any) => b.score - a.score);
        const trimmed = decayed.slice(0, 100);
        await this.env.KV.put(key, JSON.stringify({ window: w, items: trimmed }));
      }
    }
  }
}


