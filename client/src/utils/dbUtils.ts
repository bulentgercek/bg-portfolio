/**
 * Sort Database Arrays
 * @param array T[]
 * @param by "name" | "id"
 * @returns T[]
 */
type Sort = {
  name: string;
  id: number;
  updatedDate?: Date;
  orderId?: number;
};

export const sortDbArray = <T extends Sort>(
  array: T[] | null,
  by: "name" | "id" | "date" | "orderId",
  order: "asc" | "desc" = "asc",
) => {
  let result: T[] = [];

  if (array) {
    const multiplier = order === "asc" ? 1 : -1;

    if (by === "name") {
      result = [...array].sort((a, b) => a.name.localeCompare(b.name) * multiplier);
    }

    if (by === "id") {
      result = [...array].sort((a, b) => (a.id - b.id) * multiplier);
    }

    if (by === "date") {
      result = [...array].sort((a, b) => {
        if (a.updatedDate && b.updatedDate) {
          const dateA = new Date(a.updatedDate);
          const dateB = new Date(b.updatedDate);
          return (dateA.getTime() - dateB.getTime()) * multiplier;
        }
        return 0;
      });
    }

    if (by === "orderId") {
      result = [...array].sort((a, b) => {
        if (typeof a.orderId === "number" && typeof b.orderId === "number") {
          return (a.orderId - b.orderId) * multiplier;
        }
        return 0;
      });
    }
  }
  return result;
};
