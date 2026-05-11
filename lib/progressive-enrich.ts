/**
 * Progressive Batch Loading Utility
 */

export interface BatchOptions<T> {
  items: T[];
  batchSize: number;
  delayBetweenBatches: number;
  enrichFn: (item: T, index: number) => Promise<T>;
  onProgress?: (completed: number, total: number) => void;
  onBatchComplete?: (batch: T[], batchIndex: number) => void;
}

export interface ProgressiveResult<T> {
  items: T[];
  completed: number;
  total: number;
  isComplete: boolean;
}

export async function* progressiveBatchEnrich<T>({
  items,
  batchSize,
  delayBetweenBatches,
  enrichFn,
  onProgress,
  onBatchComplete,
}: BatchOptions<T>): AsyncGenerator<ProgressiveResult<T>, void, unknown> {
  const total = items.length;
  let completed = 0;
  const enrichedItems: T[] = [...items];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchIndex = Math.floor(i / batchSize);

    const enrichedBatch = await Promise.all(
      batch.map((item, batchItemIndex) =>
        enrichFn(item, i + batchItemIndex).catch((error) => {
          return item;
        })
      )
    );

    enrichedBatch.forEach((enrichedItem, batchItemIndex) => {
      enrichedItems[i + batchItemIndex] = enrichedItem;
    });

    completed += batch.length;

    if (onProgress) {
      onProgress(completed, total);
    }

    if (onBatchComplete) {
      onBatchComplete(enrichedBatch, batchIndex);
    }

    yield {
      items: enrichedItems,
      completed,
      total,
      isComplete: completed >= total,
    };

    if (i + batchSize < items.length && delayBetweenBatches > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayBetweenBatches));
    }
  }
}

export async function progressiveBatchEnrichWithUpdates<T>({
  items,
  batchSize,
  delayBetweenBatches,
  enrichFn,
  onUpdate,
}: BatchOptions<T> & {
  onUpdate: (result: ProgressiveResult<T>) => void;
}): Promise<T[]> {
  const generator = progressiveBatchEnrich({
    items,
    batchSize,
    delayBetweenBatches,
    enrichFn,
    onProgress: (completed, total) => {
      onUpdate({ items: [], completed, total, isComplete: false });
    },
  });

  let finalItems: T[] = [];

  for await (const result of generator) {
    finalItems = result.items;
    onUpdate(result);
  }

  return finalItems;
}

export async function priorityProgressiveEnrich<T>({
  items,
  priorityCount = 10,
  progressiveBatchSize = 10,
  delayBetweenBatches = 100,
  enrichFn,
  onProgress,
  onPriorityComplete,
}: {
  items: T[];
  priorityCount: number;
  progressiveBatchSize: number;
  delayBetweenBatches: number;
  enrichFn: (item: T, index: number) => Promise<T>;
  onProgress?: (completed: number, total: number) => void;
  onPriorityComplete?: (priorityItems: T[]) => void;
}): Promise<T[]> {
  const total = items.length;

  const priorityItems = items.slice(0, priorityCount);
  const restItems = items.slice(priorityCount);

  const enrichedPriority = await Promise.all(
    priorityItems.map((item, index) =>
      enrichFn(item, index).catch((error) => {
        return item;
      })
    )
  );

  if (onProgress) {
    onProgress(enrichedPriority.length, total);
  }

  if (onPriorityComplete) {
    onPriorityComplete(enrichedPriority);
  }

  const enrichedRest = await progressiveBatchEnrichWithUpdates({
    items: restItems,
    batchSize: progressiveBatchSize,
    delayBetweenBatches,
    enrichFn: (item, index) => enrichFn(item, priorityCount + index),
    onUpdate: ({ completed }) => {
      if (onProgress) {
        onProgress(priorityCount + completed, total);
      }
    },
  });

  return [...enrichedPriority, ...enrichedRest];
}
