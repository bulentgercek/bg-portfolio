import { TypeOf } from "zod";
import { DeepPartial } from "typeorm";

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

/**
 * Filter given spread of strings from the given object as keys
 * @param object Object whose keys are to be filtered
 * @param arrayKeys Spread of strings
 * @returns Filtered Object
 */
export function filterObject(object: Object, ...arrayKeys: String[]) {
  if (!object) return {};
  const asArray = Object.entries(object);
  const filtered = asArray.filter(([key, value]) => {
    const resultArray: Boolean[] = [];
    for (const arrayKey in arrayKeys) {
      resultArray.push(key !== arrayKeys[arrayKey] ? true : false);
    }
    return resultArray.every((element) => element);
  });
  return Object.fromEntries(filtered);
}

/**
 *
 */
interface Container<Containee> {
  containees: Containee[];
}

export function addOrUpdateContainees<Containee extends { id: any }>(
  container: DeepPartial<Container<Containee>>,
  containee: Containee,
): void {
  if (!container.containees) {
    container.containees = [containee];
  } else {
    const existingIndex = container.containees.findIndex(
      (c) => c.id === containee.id,
    );
    if (existingIndex !== -1) {
      container.containees[existingIndex] = containee;
    } else {
      container.containees.push(containee);
    }
  }
}
