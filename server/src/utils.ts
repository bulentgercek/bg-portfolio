/**
 * Moves items in given array (as reference)
 * @param arr Array that you want to change the order
 * @param from Position of the item that you want to move
 * @param to Position of the new location
 * @returns Updated referenced array
 */
export function changeArrayOrder<T>(arr: T[], from: number, to: number): T[] {
  arr.splice(to, 0, arr.splice(from, 1)[0]);
  return arr;
}
