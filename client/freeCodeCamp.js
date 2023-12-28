cardsAdd = [2, 3, 4, 5, 6];
cardsNeutral = [7, 8, 9];
cardsSubtract = [10, "J", "Q", "K", "A"];

let count = 0;

const cc = (card) => {
  isAdd = cardsAdd.find((data) => data === card);
  isNeutral = cardsNeutral.find((data) => data === card);
  isSubtract = cardsSubtract.find((data) => data === card);

  if (isAdd) count++;
  if (isSubtract) count--;

  if (count <= 0) return count + " Hold";
  return count + " Bet";
};

const tabs = [1, 2, 3];
const tabsUpd = tabs.splice(0, 5);
console.log(tabs, tabsUpd);
