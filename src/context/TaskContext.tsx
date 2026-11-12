import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { fetchSampleTasksFromApi } from '@/services/api';
import {
  clearTasksFromStorage,
  loadTasksFromStorage,
  saveTasksToStorage,
} from '@/services/storage';
import { CreateTaskInput, Task, UpdateTaskInput } from '@/types/task';

export interface ImportTasksResult {
  addedCount: number;
  skippedCount: number;
}

interface TaskContextValue {
  tasks: Task[];
  isLoading: boolean;
  addTask: (input: CreateTaskInput) => void;
  updateTask: (id: string, input: UpdateTaskInput) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  importTasks: () => Promise<ImportTasksResult>;
  clearAllTasks: () => Promise<void>;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore saved tasks from AsyncStorage on startup
  useEffect(() => {
    let isMounted = true;

    async function initializeTasks() {
      const storedTasks = await loadTasksFromStorage();
      if (isMounted) {
        setTasks(storedTasks);
        setIsLoading(false);
      }
    }

    initializeTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  // Save tasks whenever they change, only after initial load completes
  useEffect(() => {
    if (!isLoading) {
      saveTasksToStorage(tasks);
    }
  }, [tasks, isLoading]);

  const addTask = useCallback((input: CreateTaskInput) => {
    const newTask: Task = {
      id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: input.title.trim(),
      description: input.description.trim(),
      completed: false,
      priority: input.priority,
      dueDate: input.dueDate,
      createdAt: new Date().toISOString(),
      completedAt: null,
      source: 'local',
    };

    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const updateTask = useCallback((id: string, input: UpdateTaskInput) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              title: input.title.trim(),
              description: input.description.trim(),
              priority: input.priority,
              dueDate: input.dueDate,
            }
          : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }, []);

  const toggleTaskCompletion = useCallback((id: string) => {
    const nowIso = new Date().toISOString();
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) {
          return task;
        }
        const nextCompleted = !task.completed;
        return {
          ...task,
          completed: nextCompleted,
          completedAt: nextCompleted ? nowIso : null,
        };
      })
    );
  }, []);

  const importTasks = useCallback(async (): Promise<ImportTasksResult> => {
    const apiTasks = await fetchSampleTasksFromApi();

    const existingExternalIds = new Set(
      tasks
        .map((t) => t.externalId)
        .filter((extId): extId is number => typeof extId === 'number')
    );

    const newTasks = apiTasks.filter((apiTask) => {
      if (
        typeof apiTask.externalId === 'number' &&
        existingExternalIds.has(apiTask.externalId)
      ) {
        return false;
      }
      return true;
    });

    const addedCount = newTasks.length;
    const skippedCount = apiTasks.length - newTasks.length;

    if (newTasks.length > 0) {
      setTasks((prev) => {
        const currentIds = new Set(
          prev
            .map((t) => t.externalId)
            .filter((extId): extId is number => typeof extId === 'number')
        );
        const uniqueToAdd = newTasks.filter(
          (t) => typeof t.externalId !== 'number' || !currentIds.has(t.externalId)
        );
        return uniqueToAdd.length > 0 ? [...uniqueToAdd, ...prev] : prev;
      });
    }

    return { addedCount, skippedCount };
  }, [tasks]);

  const clearAllTasks = useCallback(async (): Promise<void> => {
    await clearTasksFromStorage();
    setTasks([]);
  }, []);

  const value: TaskContextValue = {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    importTasks,
    clearAllTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks(): TaskContextValue {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
