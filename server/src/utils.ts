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
 * Sort Database Arrays
 * @param array T[]
 * @param by "name" | "id"
 * @returns T[]
 */
type Sort = {
  name: string;
  id: number;
};

export const sortDbArray = <T extends Sort>(array: T[] | null, by: "name" | "id") => {
  let result: T[] = [];

  if (array) {
    if (by === "name") {
      result = array.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (by === "id") {
      result = array.sort((a, b) => a.id - b.id);
    }
  }
  return result;
};
