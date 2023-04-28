import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { Prisma } from "@prisma/client";

const todoSchema = z.object({
  id: z.string().nonempty(),
  title: z.string().nonempty(),
  completed: z.boolean().default(false),
});

export const todoRouter = createTRPCRouter({
  createTodo: publicProcedure
    .input(todoSchema.omit({ id: true }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.create({
        data: {
          ...input,
          userId: ctx.session?.user.id,
          // user: { connect: { id: ctx.session?.user.id } },
          // user: ctx.session?.user.email
        },
      });
    }),

  fetchAll: publicProcedure
    .input(
      z
        .object({
          searchText: z.string().optional(),
          orderBy: z
            .object({
              field: z.enum(["id", "title", "createdDate"]),
              direction: z.enum(["asc", "desc"]),
            })
            .optional(),
          // sortField: z.string().optional(),
          // sortDirection: z
          //   .union([z.literal("asc"), z.literal("desc")])
          //   .optional(),
        })
        .default({})
    )
    .query(({ ctx, input }) => {
      const filters: Prisma.TodoWhereInput[] = [];

      if (input.searchText) {
        filters.push({
          title: {
            contains: input.searchText,
          },
        });
      }

      const orderBy: Prisma.TodoOrderByWithRelationInput[] = [];

      if (input.orderBy) {
        orderBy.push({
          [input.orderBy.field]: input.orderBy.direction,
        });
      }

      // if (input.sortField === "id") {
      //   orderBy.push({
      //     id: input.sortDirection ?? "desc",
      //   });
      // }

      // if (input.sortField === "-id") {
      //   orderBy.push({
      //     id: input.sortDirection ?? "asc",
      //   });
      // }

      // if (input.sortField === "createdDate") {
      //   orderBy.push({
      //     [input.sortField]: input.sortDirection ?? "desc",
      //   });
      // }

      return ctx.prisma.todo.findMany({
        where: {
          AND: filters.length > 0 ? filters : undefined,
        },
        include: {
          user: true,
        },
        orderBy: orderBy.length > 0 ? orderBy : undefined,
      });
    }),

  updateOne: publicProcedure
    .input(
      z.object({
        id: z.number(),
        data: todoSchema.omit({ id: true }),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  fetchOne: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.todo.findUnique({ where: { id: input.id } });
    }),

  deleteOne: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.delete({ where: { id: input.id } });
    }),
});
