export function chunk<T>(inputArray: T[], size: number): T[][] {
  return inputArray.reduce((stepArray, item, index) => {
    const chunkIndex = Math.floor(index / size);

    const nextArray: T[][] = [...stepArray];
    if (!nextArray[chunkIndex]) {
      nextArray[chunkIndex] = []; // start a new chunk
    }

    nextArray[chunkIndex].push(item);

    return nextArray;
  }, [] as T[][]);
}
