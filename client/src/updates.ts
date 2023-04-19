type Update = {
  name: string;
  description: string;
  list: UpdateList[];
};

type UpdateList = {
  id: string;
  description: string;
  result: string;
  status: UpdateStatus;
};

enum UpdateStatus {
  New = "new",
  InProgress = "inProgress",
  Cancelled = "cancelled",
  Done = "done",
}

export const updates: Update[] = [
  {
    name: "Bugs",
    description: "Bug list",
    list: [
      {
        id: "b_1",
        description: "Navigation: Check the keys and make them unique.",
        result:
          "Fixed by creating a createKey utils function to creating unique key using item's element type + id. example: c1_i15",
        status: UpdateStatus.Done,
      },
    ],
  },
  {
    name: "Features",
    description: "Potential feature list",
    list: [
      {
        id: "f_1",
        description:
          "Navigation: Color theme is not matching with the design. We need to create a Layered Class handler feature.",
        result:
          "I came up with the better solution. Theme design fixed and we dont need Layered Class handler anymore.",
        status: UpdateStatus.Done,
      },
    ],
  },
];
