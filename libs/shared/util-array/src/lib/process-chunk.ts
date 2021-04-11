export async function processChunk<T>(
  array: T[][],
  processor: (chunk: T[]) => Promise<void>,
  progress: (step: number, steps: number) => void
): Promise<void> {
  const steps = array.length;
  for (const [i, chunk] of array.entries()) {
    await processor(chunk);
    progress(i + 1, steps);
  }
}
