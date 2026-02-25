"use server";

import { prisma } from "@/utils/prisma";
export const updateTask = async (idTask: string, newtask: string) => {
  try {
    if (!idTask || !newtask) return;
    const editedTask = await prisma.task.update({
      where: {
        id: idTask,
      },
      data: {
        task: newtask,
      },
    });
    if (!editedTask) return;
  } catch (error) {
    throw error;
  }
};
