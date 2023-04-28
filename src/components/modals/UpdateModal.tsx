import React from "react";
import TodoForm, { TodoFormValues } from "../TodoForm";
import { api } from "~/utils/api";
import { ContextModalProps } from "@mantine/modals";

type Props = ContextModalProps<{
  todoId: number;
}>;

const UpdateModal = ({ context, id, innerProps }: Props) => {
  const utils = api.useContext();

  const updateTodo = api.todo.updateOne.useMutation({
    onSettled() {
      utils.todo.invalidate();
    },
  });

  const { data, isLoading, error } = api.todo.fetchOne.useQuery({
    id: innerProps.todoId,
  });

  const handleSubmit = (values: TodoFormValues) => {
    updateTodo.mutate({ id: innerProps.todoId, data: values });
    context.closeModal(id);
  };

  console.log(data);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <TodoForm
      onSubmit={handleSubmit}
      defaultValues={{
        title: data?.title,
        completed: data?.completed,
      }}
    />
  );
};

export default UpdateModal;
