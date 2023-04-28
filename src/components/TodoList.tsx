import React, { useEffect } from "react";
import { api } from "~/utils/api";
import TodoItem from "./TodoItem";
import { useTodoFiltersState } from "~/store/todoFilters";
import { Group, Pagination, Menu, Button, Text, Chip } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { useSession } from "next-auth/react";

const TodoList = () => {
  const todoFiltersState = useTodoFiltersState();
  const { data: sessionUser } = useSession();
  const [checkedMyTodo, setCheckedMyTodo] = React.useState(false);
  const [checkedAllTodo, setCheckedAllTodo] = React.useState(false);

  console.log(checkedMyTodo);
  const { data: todos } = api.todo.fetchAll.useQuery(
    {
      searchText: todoFiltersState.searchText,
      orderBy: {
        field: todoFiltersState.sortField,
        direction: todoFiltersState.sortDirection,
      },
      user: todoFiltersState.user,
    },
    {
      initialData: [],
    }
  );
  const [activePage, setActivePage] = React.useState(1);
  const itemsPerPage = 6;
  const [sortText, setSortText] = React.useState("по умолчанию");

  function calcPages() {
    const begin = (activePage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    const filteredTodos = checkedMyTodo
      ? todos.filter((todo) => todo.userId == sessionUser?.user.id)
      : todos;
    return todos.slice(begin, end);
  }

  const handleSortChange = (sortOption: {
    title: string;
    field: string;
    direction: string;
  }) => {
    setSortText(sortOption.title);
    if (["id", "title", "createdDate"].includes(sortOption.field)) {
      todoFiltersState.setSort(
        sortOption.field as "id" | "title" | "createdDate",
        sortOption.direction as "asc" | "desc"
      );
    }
  };

  const handleChangeMyTodo = () => {
    todoFiltersState.setUser(sessionUser?.user.email || "");
    setCheckedMyTodo(true);
  };

  // checkedMyTodo ? handleChangeMyTodo() : "";

  return (
    <div className=" w-1/3 text-center">
      <h1 className=" my-5">TodoList</h1>
      <div className=" filter-block flex  justify-around">
        <div className=" flex-col items-start">
          <Chip
            checked={checkedMyTodo}
            onChange={() => {
              todoFiltersState.setUser(sessionUser?.user.email || "");
              setCheckedMyTodo(!checkedMyTodo);
              checkedAllTodo ? setCheckedAllTodo(!checkedAllTodo) : "";
            }}
            mb={5}
          >
            Показать мои
          </Chip>
          <Chip
            checked={checkedAllTodo}
            onChange={() => {
              todoFiltersState.setUser("");
              setCheckedAllTodo(!checkedAllTodo);
              checkedMyTodo ? setCheckedMyTodo(!checkedMyTodo) : "";
            }}
          >
            Показать список всех дел
          </Chip>
        </div>

        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button style={{ background: "rgb(59 130 246 / 0.9)" }}>
              <span className=" mx-2 font-semibold">Сортировать: </span>
              {sortText}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            {sortBy.map((sortOption) => (
              <Menu.Item onClick={() => handleSortChange(sortOption)}>
                {sortOption.title}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </div>

      {calcPages().map((todo) => (
        <TodoItem todo={todo} key={todo.id} />
      ))}

      <Group position="center" className=" my-10">
        <Pagination
          value={activePage ?? 1}
          onChange={setActivePage}
          siblings={2}
          total={Math.ceil((todos?.length ?? 0) / itemsPerPage)}
        />
      </Group>
    </div>
  );
};

export default TodoList;

const sortBy = [
  // {
  //   title: "По ID",
  //   field: "id",
  //   direction: "asc",
  // },
  {
    title: "А-Я",
    field: "title",
    direction: "asc",
  },
  {
    title: "Я-А",
    field: "title",
    direction: "desc",
  },
  {
    title: "По дате (старее)",
    field: "createdDate",
    direction: "asc",
  },
  {
    title: "По дате (новее)",
    field: "createdDate",
    direction: "desc",
  },
];
