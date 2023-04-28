import React from "react";
import { openContextModal } from "@mantine/modals";
import { IconSquarePlus } from "@tabler/icons-react";
import Login from "./Login";
import { useTodoFiltersState } from "~/store/todoFilters";
import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoonStars } from "@tabler/icons-react";

const Navbar = () => {
  const openCreateModal = () => {
    openContextModal({
      title: "Create",
      modal: "createModal",
      innerProps: {},
    });
  };
  const searchText = useTodoFiltersState((state) => state.searchText);
  const setSearchText = useTodoFiltersState((state) => state.setSearchText);

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <div className=" mx-auto mt-10 w-1/2 flex-col items-center justify-around">
      <ActionIcon
        variant="outline"
        color={dark ? "yellow" : "blue"}
        onClick={() => toggleColorScheme()}
        title="Toggle color scheme"
        className=" mx-auto"
      >
        {dark ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
      </ActionIcon>
      <div className="mx-auto my-10 flex items-center justify-around">
        <div className=" search mx-5 w-1/2">
          {/* <form onSubmit={handleSubmit}> */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                aria-hidden="true"
                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>

            <input
              type="text"
              id="default-search"
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Search..."
              required
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
        <Login />
      </div>

      <div className=" mx-auto flex justify-center">
        <button
          onClick={openCreateModal}
          className=" flex h-14 w-14 rounded-lg border bg-blue-500 shadow-lg"
        >
          <IconSquarePlus size={50} color="white" className=" m-auto " />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
