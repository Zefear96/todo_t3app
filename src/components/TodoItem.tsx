import React from "react";
import { api } from "~/utils/api";
import { openContextModal } from "@mantine/modals";
import { Todo } from "@prisma/client";
import { Text } from "@mantine/core";
import { IconSettings, IconTrash } from "@tabler/icons-react";
import { useMantineColorScheme } from "@mantine/core";

type Props = { todo: Todo };

const TodoItem = ({ todo }: Props) => {
  const utils = api.useContext();

  const openUpdateModal = () => {
    openContextModal({
      title: "Update",
      modal: "updateModal",
      innerProps: {
        todoId: todo.id,
      },
    });
  };

  const deleteTodo = api.todo.deleteOne.useMutation({
    onSettled() {
      utils.todo.invalidate();
    },
  });

  const updateTodo = api.todo.updateOne.useMutation({
    onSettled() {
      utils.todo.invalidate();
    },
  });

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <div className=" borde my-5 flex h-20 items-center justify-between rounded-xl bg-slate-200 shadow-lg">
      <input
        checked={todo.completed}
        type="checkbox"
        onChange={() =>
          updateTodo.mutate({
            id: todo.id,
            data: { ...todo, completed: !todo.completed },
          })
        }
        className=" mx-5  h-5 w-20 rounded-md"
      />
      <Text size={13}>{todo.createdDate.toLocaleString()}</Text>
      {/* <Text size={13}>{todo.userId}</Text> */}

      <Text
        style={{
          textDecoration: todo.completed ? "line-through" : "",
        }}
        className="w-1/2"
      >
        {todo.title}
      </Text>

      <button
        onClick={openUpdateModal}
        className=" mx-5 h-10 w-10 rounded-md
        bg-yellow-400"
      >
        <IconSettings color="white" className=" mx-auto" />
      </button>

      <button
        onClick={() => deleteTodo.mutate({ id: todo.id })}
        className=" mx-5 h-10 w-10 rounded-md
        bg-red-400"
      >
        <IconTrash color="white" className=" mx-auto" />
      </button>
    </div>
  );
};

export default TodoItem;
