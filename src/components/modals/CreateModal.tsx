import React from "react";
import { ContextModalProps } from "@mantine/modals";
import TodoForm, { TodoFormValues } from "../TodoForm";
import { api } from "~/utils/api";

type Props = ContextModalProps<{}>;

const CreateModal = ({ context, id, innerProps }: Props) => {
  const utils = api.useContext();

  const createTodoMutate = api.todo.createTodo.useMutation({
    onSettled() {
      utils.todo.invalidate();
    },
  });

  const handleSubmit = (data: TodoFormValues) => {
    createTodoMutate.mutate(data);
    context.closeModal(id);
  };

  return <TodoForm onSubmit={handleSubmit} />;
};

export default CreateModal;
