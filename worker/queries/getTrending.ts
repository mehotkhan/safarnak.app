import { getServerDB, feedEvents } from '@database/server';
import type { GraphQLContext } from '../types';
import { and, desc, eq, sql } from 'drizzle-orm';
import { readTopList } from '../utilities/trending';

type TrendingType = 'TOPIC' | 'PLACE' | 'USER' | 'ENTITY';
type TimeWindow = 'M5' | 'H1' | 'D1';

function windowToSeconds(window: TimeWindow): number {
  switch (window) {
    case 'M5':
      return 5 * 60;
    case 'H1':
      return 60 * 60;
    case 'D1':
      return 24 * 60 * 60;
    default:
      return 60 * 60;
  }
}

function toSqliteTimestampSecondsAgo(seconds: number): string {
  // SQLite CURRENT_TIMESTAMP format is 'YYYY-MM-DD HH:MM:SS'
  const d = new Date(Date.now() - seconds * 1000);
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
  const yyyy = d.getUTCFullYear();
  const mm = pad(d.getUTCMonth() + 1);
  const dd = pad(d.getUTCDate());
  const hh = pad(d.getUTCHours());
  const mi = pad(d.getUTCMinutes());
  const ss = pad(d.getUTCSeconds());
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

export const getTrending = async (
  _parent: unknown,
  { type, window, entityTypes, limit = 10 }: { type: TrendingType; window: TimeWindow; entityTypes?: string[]; limit?: number },
  context: GraphQLContext
) => {
  const db = getServerDB(context.env.DB);
  const sinceTs = toSqliteTimestampSecondsAgo(windowToSeconds(window));

  if (type === 'ENTITY') {
    // Prefer KV top list if available
    try {
      const kvItems = await readTopList(context.env, 'entity', window, limit);
      if (kvItems.length > 0) {
        const items = kvItems.map((i) => ({ key: i.key, label: i.label, score: i.score, delta: null as any }));
        return { window, items };
      }
    } catch {
      // ignore KV read errors
    }
    // Count feed events per entityType in the time window
    // Drizzle doesn't have groupBy aggregate helpers in sqlite-core yet; use raw SQL
    const allowed = entityTypes && entityTypes.length > 0 ? entityTypes : ['POST', 'TRIP', 'TOUR', 'PLACE', 'LOCATION'];
    const rows = await db
      .all<{ entityType: string; c: number }>(
        sql`select ${feedEvents.entityType} as entityType, count(*) as c 
            from ${feedEvents}
            where ${feedEvents.createdAt} >= ${sinceTs}
              and ${feedEvents.visibility} = 'PUBLIC'
              and ${feedEvents.entityType} in (${sql.join(allowed)})
            group by ${feedEvents.entityType}
            order by c desc
            limit ${limit}`
      );

    const items = rows.map((r) => ({
      key: r.entityType,
      label: r.entityType,
      score: Number(r.c || 0),
      delta: null,
    }));

    return { window, items };
  }

  if (type === 'TOPIC') {
    try {
      const kvItems = await readTopList(context.env, 'topic', window, limit);
      const items = kvItems.map((i) => ({ key: i.key, label: `#${i.label}`, score: i.score, delta: null as any }));
      return { window, items };
    } catch {
      return { window, items: [] };
    }
  }

  // PLACE/USER to be added in later sub-phase
  return { window, items: [] };
};


