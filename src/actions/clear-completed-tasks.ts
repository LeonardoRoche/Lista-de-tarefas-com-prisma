"use server";

import { prisma } from "@/utils/prisma";

export const clearCompletedTasks = async () => {
  try {
    await prisma.task.deleteMany({
      where: {
        done: true,
      },
    });
  } catch (error) {
    throw error;
  }
};
