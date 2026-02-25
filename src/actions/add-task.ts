"use server";
import { prisma } from "@/utils/prisma";

export const NewTask = async (tarefa: string) => {
  try {
    if (!tarefa) return;

    const newTask = await prisma.task.create({
      data: {
        task: tarefa,
        done: false,
      },
    });

    if (!newTask) return;
    return newTask;
  } catch (error) {
    throw error;
  }
};
