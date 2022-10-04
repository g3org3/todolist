import { z } from 'zod'

import { createProtectedRouter } from './context'

// Example router with queries that can only be hit if the user requesting is signed in
export const protectedExampleRouter = createProtectedRouter()
  .query('todolist', {
    resolve: ({ ctx }) => {
      const userId = ctx.session.user.id

      return ctx.prisma.todo.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })
    },
  })
  .query('checklist', {
    input: z.string(),
    resolve: ({ ctx, input }) => {
      const userId = ctx.session.user.id

      return ctx.prisma.checklistItem.findMany({
        where: { todoId: input },
        orderBy: { createdAt: 'desc' },
      })
    },
  })
  .mutation('done', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      await ctx.prisma.todo.update({ data: { doneAt: new Date() }, where: { id: input } })
    },
  })
  .mutation('update', {
    input: z.object({
      id: z.string(),
      body: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      await ctx.prisma.todo.update({ data: { body: input.body }, where: { id: input.id } })
    },
  })
  .mutation('checklistdone', {
    input: z.object({
      id: z.string(),
      isChecked: z.boolean(),
    }),
    resolve: async ({ ctx, input }) => {
      await ctx.prisma.checklistItem.update({
        data: { doneAt: input.isChecked ? new Date() : null },
        where: { id: input.id },
      })
    },
  })
  .mutation('delete', {
    input: z.string(),
    resolve: async ({ ctx, input }) => {
      await ctx.prisma.todo.delete({ where: { id: input } })
    },
  })
  .mutation('create', {
    input: z.object({
      title: z.string(),
      id: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const payload = {
        ...input,
        userId,
        body: '',
      }
      await ctx.prisma.todo.create({ data: payload })
    },
  })
  .mutation('createChecklist', {
    input: z.object({
      title: z.string(),
      id: z.string(),
      todoId: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      const userId = ctx.session.user.id
      const payload = {
        ...input,
      }
      await ctx.prisma.checklistItem.create({ data: payload })
    },
  })