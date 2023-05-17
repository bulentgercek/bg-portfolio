import React, { Fragment, useContext, useEffect, useState } from "react";

import go_up from "../../assets/go_up.svg";
import { Category } from "../../api/interfaces";
import AppContext from "../../AppContext";
import Breadcrumbs from "../../components/Content/Breadcrumbs";
import CategoryItems from "../../components/Content/CategoryItems";
import { Listbox, Transition } from "@headlessui/react";
import {
  ArrowUpIcon,
  BriefcaseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { SortOrderOptions } from "../../components/Content/ItemGrid";
import { createCategoryItemList } from "../../utils/appUtils";

type SortOrderByListOptions = {
  id: SortOrderOptions["orderBy"];
  name: string;
};

export const sortOrderByListBoxOptions: SortOrderByListOptions[] = [
  { id: "orderByName", name: "By Name" },
  { id: "orderByDate", name: "Update" },
];

const CategoryContentLayout: React.FC = () => {
  const { dbCategories, breadcrumbs, routeData, contentSizeData } = useContext(AppContext);
  const [currentCategory, setCurrentCategory] = useState<Category>();
  const [sortOrderByListSelected, setSortOrderByListSelected] = useState(sortOrderByListBoxOptions[0]);
  const [sortOrderSelected, setSortOrderSelected] = useState<SortOrderOptions["order"]>("asc");

  useEffect(() => {
    const newCategory = breadcrumbs.find((bc) => bc.id === routeData.cid);
    if (newCategory) setCurrentCategory(newCategory);
  }, [breadcrumbs]);

  const getContentSize = () => {
    return Math.round(contentSizeData?.width ?? 0);
  };

  const contentSize = getContentSize();

  /**
   * Info Panel For Current Category
   * @returns JSX.Element
   */
  const infoPanel = (): JSX.Element => {
    const categoryCount = currentCategory?.childCategories?.length ?? 0;
    const getItemCount = () => {
      if (!dbCategories || !routeData.cid) return 0;
      return createCategoryItemList(dbCategories, routeData.cid).length;
    };

    const itemCount = getItemCount();

    return (
      <div className="flex min-w-fit flex-col justify-center gap-3 rounded-2xl border-2 border-dashed border-indigo-200 p-5 text-indigo-900">
        <div className="flex flex-row gap-2">
          <Squares2X2Icon className="h-6 w-6" />
          <span>{categoryCount} Categories</span>
        </div>
        <div className="flex flex-row gap-2">
          <BriefcaseIcon className="h-6 w-6" />
          <span>{itemCount} Works</span>
        </div>
      </div>
    );
  };

  /**
   * Go Upper Category Button
   * @returns JSX.Element
   */
  const goUpperCategory = (): JSX.Element => {
    let upperCategoryRoute = `/category/${currentCategory?.parentCategory?.id}`;
    if (!currentCategory?.parentCategory) upperCategoryRoute = "/";

    return (
      <Link to={upperCategoryRoute}>
        <img
          className="trans-d500 min-h-[45px] min-w-[45px] hover:-translate-y-1 hover:brightness-125"
          src={go_up}
          alt="go_up"
        ></img>
      </Link>
    );
  };

  /**
   * Navigation For Child Categories
   * @returns JSX.Element | undefined
   */
  const childCategoriesNavigation = (): JSX.Element | undefined => {
    const contentSizeForBoxChange = 860;
    const contentSizeForSubCategoriesName = 270;

    if (!currentCategory || currentCategory.childCategories?.length === 0) return;

    const childCategoryCount = currentCategory.childCategories?.length ?? 1;

    const getRounded = (index: number) => {
      return index === 0
        ? "hover:pr-3 pl-5 rounded-l-2xl rounded-r-md"
        : index === childCategoryCount - 1
        ? "hover:pl-3 pr-5 rounded-r-2xl rounded-l-md"
        : "hover:px-3 rounded-md";
    };

    const subCategoriesNameHandler = () => {
      return contentSize > contentSizeForSubCategoriesName ? "Subcategories" : "SubC...";
    };

    return (
      <>
        {contentSize > contentSizeForBoxChange && (
          <div
            id="navigation"
            className="flex flex-row items-center rounded-2xl border-2 border-dashed border-indigo-400"
          >
            {currentCategory.childCategories?.map((category, index) => (
              <React.Fragment key={category.id}>
                <Link to={`/category/${category.id}`}>
                  <button
                    className={`${getRounded(
                      index,
                    )} trans-d500 p-2 text-base font-bold text-indigo-900 hover:bg-blue-100 hover:text-blue-600`}
                  >
                    <p>{category.name}</p>
                  </button>
                </Link>
                {index !== (currentCategory.childCategories?.length ?? 0) - 1 && <span>|</span>}
              </React.Fragment>
            ))}
          </div>
        )}
        {contentSize <= contentSizeForBoxChange && (
          <div className="relative w-fit">
            <Listbox value={""}>
              <Listbox.Button className="trans-d200 flex flex-row items-center rounded-2xl border-2 border-dashed border-indigo-400 p-2 pl-5 text-base font-bold text-indigo-900 hover:bg-blue-100 hover:text-blue-600">
                <p>{subCategoriesNameHandler()}</p>
                <ChevronDownIcon className="h-6 w-6 text-slate-500 group-hover:text-slate-50" />
              </Listbox.Button>
              <Transition as={Fragment} leave="trans-d200" leaveFrom="opacity-100" leaveTo="opacity-0">
                <Listbox.Options className="absolute z-30 mt-1 w-[calc(100%)] rounded-2xl border-2 border-dashed border-indigo-400 bg-indigo-200 p-2 align-baseline">
                  {currentCategory.childCategories?.map((category, index) => (
                    <Link key={category.id} to={`/category/${category.id}`}>
                      <Listbox.Option
                        key={category.id}
                        value={category.id}
                        className="trans-d500 rounded-xl p-2 pl-4 text-base font-bold text-indigo-900 hover:bg-blue-100 hover:text-blue-600"
                      >
                        <ChevronRightIcon className="ui-selected:block hidden w-6" />
                        <span>{category.name}</span>
                      </Listbox.Option>
                    </Link>
                  ))}
                </Listbox.Options>
              </Transition>
            </Listbox>
          </div>
        )}
      </>
    );
  };

  /**
   * Order Items List Box Defaults
   */
  useEffect(() => {
    if (sortOrderByListSelected.id === "orderByName") setSortOrderSelected("asc");
    if (sortOrderByListSelected.id === "orderByDate") setSortOrderSelected("desc");
  }, [sortOrderByListSelected]);

  /**
   * Order Items List Box
   * @returns JSX.Element
   */
  const sortOrderByListBox = (): JSX.Element => {
    return (
      <div className="relative w-fit">
        <Listbox value={sortOrderByListSelected} onChange={setSortOrderByListSelected}>
          <Listbox.Button className="trans-d200 group relative flex flex-row items-center gap-5 rounded-2xl bg-indigo-300 p-2.5 pl-5 text-left font-semibold text-indigo-900 hover:bg-indigo-500 hover:text-indigo-50">
            {sortOrderByListSelected.name}
            <ChevronDownIcon className="h-6 w-6 text-slate-500 group-hover:text-slate-50" />
          </Listbox.Button>
          <Transition as={Fragment} leave="trans-d200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="absolute z-30 mt-1 w-[calc(100%)] rounded-2xl bg-indigo-300 p-2 align-baseline">
              {sortOrderByListBoxOptions.map((option) => (
                <Listbox.Option
                  key={option.id}
                  value={option}
                  className="ui-active:bg-blue-600 ui-active:text-white ui-not-active:bg-white/0 ui-not-active:text-indigo-900  flex cursor-pointer flex-row rounded-xl bg-white p-2 font-bold"
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

  const flexWrapHandler = () => {
    if (contentSize >= 650) {
      return "flex-nowrap";
    } else {
      return "flex-wrap";
    }
  };

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-blue-200 p-5 pt-10">
      {/* Header */}
      <div className={`flex flex-row justify-between gap-5 rounded-xl bg-blue-100 p-5 ${flexWrapHandler()}`}>
        <div className="flex flex-col gap-2">
          <Breadcrumbs pageType="Category" />
          <div>
            <div className="text-lg font-bold text-indigo-900">{currentCategory?.name}</div>
            <div className="">{currentCategory?.description}</div>
          </div>
        </div>
        {infoPanel()}
      </div>

      {/* Navigation */}
      <div className="flex min-h-[12px] flex-row flex-wrap items-center gap-4">
        <div className="flex flex-row items-center gap-4">
          {goUpperCategory()}
          {childCategoriesNavigation()}
        </div>
        <div className="flex flex-row items-center gap-4">{sortOrderByListBox()}</div>
      </div>

      {/* Category Items Component */}
      <CategoryItems sortOrderOptions={{ orderBy: sortOrderByListSelected.id, order: sortOrderSelected }} />
    </div>
  );
};

export default CategoryContentLayout;
