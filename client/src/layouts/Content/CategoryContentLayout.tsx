import React, { Fragment, useContext, useEffect, useState } from "react";

import go_up from "../../assets/go_up.svg";
import { Category } from "../../api/interfaces";
import AppContext from "../../AppContext";
import Breadcrumbs from "../../components/Content/Breadcrumbs";
import CategoryItems from "../../components/Content/CategoryItems";
import { Listbox, Transition } from "@headlessui/react";
import { ArrowsUpDownIcon, ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { SortOrderOptions } from "../../components/Content/ItemGrid";

type SortOrderByListOptions = {
  id: SortOrderOptions["orderBy"];
  name: string;
};

export const sortOrderByListBoxOptions: SortOrderByListOptions[] = [
  { id: "orderByName", name: "Order By Name" },
  { id: "orderByDate", name: "Order By Update" },
];

const CategoryContentLayout: React.FC = () => {
  const { breadcrumbs, routeData } = useContext(AppContext);
  const [currentCategory, setCurrentCategory] = useState<Category>();
  const [sortOrderByListSelected, setSortOrderByListSelected] = useState(sortOrderByListBoxOptions[0]);
  const [sortOrderSelected, setSortOrderSelected] = useState<SortOrderOptions["order"]>("asc");

  useEffect(() => {
    const newCategory = breadcrumbs.find((bc) => bc.id === routeData.cid);
    if (newCategory) setCurrentCategory(newCategory);
  }, [breadcrumbs]);

  const goUpperCategory = (): JSX.Element => {
    let upperCategoryRoute = `/category/${currentCategory?.parentCategory?.id}`;
    if (!currentCategory?.parentCategory) upperCategoryRoute = "/";

    return (
      <Link to={upperCategoryRoute}>
        <img className="trans-d500 hover:-translate-y-1 hover:brightness-125" src={go_up} alt="go_up"></img>
      </Link>
    );
  };

  const childCategoriesNavigation = (): JSX.Element | undefined => {
    if (!currentCategory || currentCategory.childCategories?.length === 0) return;

    const childCategoryCount = currentCategory.childCategories?.length ?? 1;

    const getRounded = (index: number) => {
      return index === 0
        ? "hover:pr-3 pl-5 rounded-l-2xl rounded-r-md"
        : index === childCategoryCount - 1
        ? "hover:pl-3 pr-5 rounded-r-2xl rounded-l-md"
        : "hover:px-3 rounded-md";
    };

    return (
      <div
        id="navigation"
        className="box-border flex flex-row items-center rounded-2xl border-2 border-dashed border-indigo-400"
      >
        {currentCategory.childCategories?.map((category, index) => (
          <React.Fragment key={category.id}>
            <Link to={`/category/${category.id}`}>
              <div
                className={`${getRounded(
                  index,
                )} trans-d500 p-2 text-base font-bold text-indigo-900 hover:bg-blue-100 hover:text-blue-600`}
              >
                {category.name}
              </div>
            </Link>
            {index !== (currentCategory.childCategories?.length ?? 0) - 1 && <span>|</span>}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const sortOrderByListBox = (): JSX.Element => {
    return (
      <div className="relative w-60">
        <Listbox value={sortOrderByListSelected} onChange={setSortOrderByListSelected}>
          <Listbox.Button className="relative flex flex-row items-center justify-between gap-5 rounded-2xl bg-indigo-300 p-2.5 pl-5 text-left font-semibold text-indigo-900">
            {sortOrderByListSelected.name}
            <ChevronDownIcon className="h-6 w-6 text-slate-500" />
          </Listbox.Button>
          <Transition as={Fragment} leave="trans-d200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="absolute top-12 z-30 w-[calc(97%)] rounded-2xl bg-indigo-300 p-2">
              {sortOrderByListBoxOptions.map((option) => (
                <Listbox.Option
                  key={option.id}
                  value={option}
                  className="ui-active:bg-blue-600 ui-active:text-white ui-not-active:bg-white/0 ui-not-active:text-indigo-900 flex cursor-pointer flex-row rounded-xl bg-white p-2"
                >
                  <ChevronRightIcon className="ui-selected:block hidden w-6" />
                  <span>{option.name}</span>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </Listbox>
      </div>
    );
  };

  const sortOrderButton = (): JSX.Element => {
    const sortOrderHandler = () => {
      setSortOrderSelected(sortOrderSelected === "asc" ? "desc" : "asc");
    };

    return (
      <div>
        <ArrowsUpDownIcon className="h-6 w-6 cursor-pointer" onClick={sortOrderHandler}></ArrowsUpDownIcon>
      </div>
    );
  };

  return (
    <div className="flex w-full flex-col gap-5 rounded-2xl bg-blue-200 p-5 pt-10">
      {/* Header */}
      <div className="flex w-full flex-row justify-between rounded-xl bg-blue-100 p-5">
        <div className="flex flex-col gap-2">
          <Breadcrumbs pageType="Category" />
          <div>
            <div className="text-lg font-bold text-indigo-900">{currentCategory?.name}</div>
            <div className="">{currentCategory?.description}</div>
          </div>
        </div>
        <div className="flex min-w-[218px] p-5">Info Panel</div>
      </div>

      {/* Navigation */}
      <div className="flex h-12 items-center gap-5">
        {goUpperCategory()}
        {childCategoriesNavigation()}
        {sortOrderByListBox()}
        {sortOrderButton()}
      </div>

      {/* Category Items Component */}
      <CategoryItems sortOrderOptions={{ orderBy: sortOrderByListSelected.id, order: sortOrderSelected }} />
    </div>
  );
};

export default CategoryContentLayout;
