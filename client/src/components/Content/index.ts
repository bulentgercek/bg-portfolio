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
    [stateKey in keyof T]: string;
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
// /**
//  * Helper function to infer StateCollection
//  * @param statesData
//  * @param collectionData
//  * @returns
//  */
// export const createStateCollection = <T extends StateData<T>>(
//   statesData: StateData<T>,
//   collectionData: StateCollection<typeof statesData>,
// ): StateCollection<typeof statesData> => {
//   return collectionData;
// };
