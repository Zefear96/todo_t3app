import { useForm, zodResolver } from "@mantine/form";
import React from "react";
import { z } from "zod";

const todoFormSchema = z.object({
  title: z.string().nonempty(),
  completed: z.boolean().default(false),
});

export type TodoFormValues = z.infer<typeof todoFormSchema>;

type Props = {
  onSubmit(values: TodoFormValues): void;
  defaultValues?: Partial<TodoFormValues>;
};

const TodoForm = ({ onSubmit, defaultValues = {} }: Props) => {
  const form = useForm<TodoFormValues>({
    initialValues: {
      title: "",
      completed: false,
      ...defaultValues,
    },
    validate: zodResolver(todoFormSchema),
  });

  const handleSubmit = (values: TodoFormValues) => {
    onSubmit(values);
    form.reset();
  };

  return (
    <form
      onSubmit={form.onSubmit(handleSubmit)}
      className="m-5  flex justify-around"
    >
      <input
        type="text"
        className=" h-10 w-full rounded-md border border-blue-500 px-3"
        {...form.getInputProps("title")}
        autoFocus
      />
      {/* <input
        checked={defaultValues.completed}
        type="checkbox"
        {...form.getInputProps("completed", { type: "checkbox" })}
      /> */}
      <button
        type="submit"
        className=" mx-5 h-10 w-20 rounded-lg border border-blue-300 bg-blue-400"
      >
        Add
      </button>
    </form>
  );
};

export default TodoForm;
