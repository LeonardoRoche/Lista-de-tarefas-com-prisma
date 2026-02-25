"use client";
import EditTask from "@/components/edit-task";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ListCheck, LoaderCircle, Plus, Sigma, Trash } from "lucide-react";

import { getTasks } from "@/actions/get-taks-from-bd";
import { useEffect, useState } from "react";
import { Task } from "@/generated/prisma";
import { NewTask } from "@/actions/add-task";
import { deleteTask } from "@/actions/delete-task";
import { toast } from "sonner";
import Filter, { filterType } from "@/components/filter";
import { clearCompletedTasks } from "@/actions/clear-completed-tasks";
import { updateTaskStatus } from "@/actions/toogle-done";

export default function Home() {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [task, setTask] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentFielter, setCurrentFilter] = useState<filterType>("all");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  const handleGetTasks = async () => {
    try {
      const tasks = await getTasks();
      if (!tasks) return;
      setTaskList(tasks);
    } catch (error) {
      throw error;
    }
  };

  const handleAddTask = async () => {
    setLoading(true);
    try {
      if (task.length === 0 || !task) {
        toast.error("Insira uma atividade para cadastrar!");
        setLoading(false);
        return;
      }

      const myNewTask = await NewTask(task);

      if (!myNewTask) return;

      toast.success("Tarefa criada com sucesso!");

      setTask("");
      await handleGetTasks();
    } catch (error) {
      throw error;
    }
    setLoading(false);
  };

  const handleDeleteTask = async (id: string) => {
    try {
      if (!id) return;
      await deleteTask(id);
      toast.success("Tarefa deletada com sucesso!");
      await handleGetTasks();
    } catch (error) {
      throw error;
    }
  };

  const handleToogleTask = async (taskid: string) => {
    const previousTasks = [...taskList];
    try {
      setTaskList((prev) => {
        const updatedTaskList = prev.map((task) => {
          if (task.id === taskid) {
            return {
              ...task,
              done: !task.done,
            };
          } else {
            return task;
          }
        });
        return updatedTaskList;
      });

      const updatedTask = await updateTaskStatus(taskid);
      if (!updatedTask) {
        throw new Error("Falha ao atualizar o status da tarefa");
      }
    } catch (error) {
      setTaskList(previousTasks);
      toast.error("Não foi possível atualizar o status da tarefa");
      throw error;
    }
  };

  const handleClearCompletedTasks = async () => {
    await clearCompletedTasks();
    toast.success("Tarefas concluídas limpas com sucesso!");
    await handleGetTasks();
  };

  useEffect(() => {
    handleGetTasks();
  }, []);

  useEffect(() => {
    switch (currentFielter) {
      case "all":
        setFilteredTasks(taskList);
        break;
      case "pending":
        const pedingTasks = taskList.filter((task) => !task.done);
        setFilteredTasks(pedingTasks);
        break;
      case "completed":
        const completedTasks = taskList.filter((task) => task.done);
        setFilteredTasks(completedTasks);
        break;
      default:
        setFilteredTasks(taskList);
    }
  }, [currentFielter, taskList]);

  return (
    <main className="bg-gray-300 w-full h-screen flex items-center justify-center">
      <Card className="w-lg p-4">
        <CardHeader className="flex gap-2">
          <Input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Adicionar tarefa"
            className="cursor-pointer"
          />
          <Button onClick={handleAddTask} className="cursor-pointer">
            {loading ? <LoaderCircle className="animate-spin" /> : <Plus />}
            Cadastrar
          </Button>
        </CardHeader>
        <CardContent>
          <Separator className="mb-4" />
          <Filter
            currentFielter={currentFielter}
            setCurrentFilter={setCurrentFilter}
          />
          <div className="mt-4 border-b">
            {filteredTasks.length === 0 && (
              <p className="text-xs border-t py-4">
                Você não possui atividades cadastradas
              </p>
            )}
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="h-14 flex justify-between items-center border-t "
              >
                <div
                  className={`${task.done ? "bg-green-300" : "bg-red-300"} w-1 h-full`}
                ></div>
                <p
                  className="px-2 flex-1 text-sm cursor-pointer hover:scale-95 transition-all duration-300 hover:text-gray-700"
                  onClick={() => handleToogleTask(task.id)}
                >
                  {task.task}
                </p>
                <div className="flex gap-2 px-2 items-center">
                  <EditTask task={task} handleGetTasks={handleGetTasks} />

                  <Trash
                    size={16}
                    className="cursor-pointer"
                    onClick={() => {
                      handleDeleteTask(task.id);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <ListCheck size={16} />
              <p className="text-xs">
                Tarefas concluídas{" "}
                {filteredTasks.filter((task) => task.done).length} /{" "}
                {filteredTasks.length}
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="cursor-pointer text-xs h-7"
                >
                  <Trash />
                  Limpar tarefas concluídas
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem certeza que deseja excluir{" "}
                    {filteredTasks.filter((task) => task.done).length} itens?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={handleClearCompletedTasks}
                    className="cursor-pointer"
                  >
                    Sim
                  </AlertDialogCancel>
                  <AlertDialogAction className="cursor-pointer">
                    Cancelar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="h-2 w-full bg-gray-100 mt-4 rounded-md">
            <div
              className="h-full  bg-blue-500 rounded-md"
              style={{
                width: `${(filteredTasks.filter((task) => task.done).length / filteredTasks.length) * 100}%`,
              }}
            ></div>
          </div>

          <div className="flex justify-end items-center mt-2 gap-2">
            <Sigma size={16} className="cursor-pointer" />
            <p className="text-xs">{filteredTasks.length} tarefas no total</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
