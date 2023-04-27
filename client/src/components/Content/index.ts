/**
 * Content Types
 */

/**
 * State Data Type
 */
export type StateData<T> = {
  [stateKey in keyof T]: {
    [stateSubKey in keyof T[stateKey]]: string;
  };
};

/**
 * State Collection Type
 */
export type StateCollection<T extends StateData<T>, K> = {
  [stateCollectionKey in keyof K]: {
    [stateKey in keyof T]: T[stateKey][keyof T[stateKey]];
  };
};

/**
 * Helper function to infer StateData
 * @param data StateData<T>
 * @returns StateData<T>
 */
export const createStateData = <T>(data: StateData<T>): StateData<T> => {
  return data;
};

/**
 * Helper function to infer StateCollection
 * @param stateData Initilized StateData<T> Object
 * @param dataFn Returns the callback function's return result
 */
export function createStateCollection<T extends StateData<T>, K>(
  stateData: T,
  dataFn: (stateData: T) => StateCollection<T, K>,
): StateCollection<T, K> {
  return dataFn(stateData);
}
