import { Todo } from "@prisma/client";
import { create } from "zustand";

interface TodoFiltersState {
  searchText: string;
  setSearchText: (searchText: string) => void;
  sortField: "id" | "title" | "createdDate";
  sortDirection: "asc" | "desc";
  setSort: (
    sortField: "id" | "title" | "createdDate",
    sortDirection: "asc" | "desc"
  ) => void;
}

export const useTodoFiltersState = create<TodoFiltersState>(
  (set, get, store) => ({
    searchText: "",
    setSearchText: (searchText) => {
      set({ searchText });
    },
    sortField: "id",
    sortDirection: "asc",
    setSort: (sortField, sortDirection) => {
      set({ sortField, sortDirection });
    },
  })
);
