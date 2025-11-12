import type { Env } from '../types';

interface EmbedJob {
  id?: string;
  entityType: string;
  entityId: string;
  text: string;
  lang?: string;
  model?: string;
}

export async function enqueueEmbeddingJob(env: Env, job: EmbedJob): Promise<void> {
  await (env.EMBED_QUEUE as any).send(job);
}


