import React from 'react';
import { router } from 'expo-router';
import { TaskForm } from '@/components/TaskForm';
import { useTasks } from '@/context/TaskContext';
import { CreateTaskInput } from '@/types/task';

export default function NewTaskScreen() {
  const { addTask } = useTasks();

  const handleCreate = (values: CreateTaskInput) => {
    addTask(values);
    router.back();
  };

  return (
    <TaskForm
      submitLabel="Save Task"
      onSubmit={handleCreate}
      onCancel={() => router.back()}
    />
  );
}

