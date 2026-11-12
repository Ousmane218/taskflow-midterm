import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AlertCircle } from 'lucide-react-native';
import { EmptyState } from '@/components/EmptyState';
import { TaskForm } from '@/components/TaskForm';
import { SPACING } from '@/constants/theme';
import { useTasks } from '@/context/TaskContext';
import { useTheme } from '@/context/ThemeContext';
import { UpdateTaskInput } from '@/types/task';

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, updateTask, deleteTask } = useTasks();
  const { colors } = useTheme();

  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return (
      <View
        style={[
          styles.missingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <EmptyState
          icon={AlertCircle}
          title="Task not found"
          description="This task may have been deleted."
          actionLabel="Go Back"
          onAction={() => router.back()}
        />
      </View>
    );
  }

  const handleUpdate = (values: UpdateTaskInput) => {
    updateTask(task.id, values);
    router.back();
  };

  const handleDelete = () => {
    deleteTask(task.id);
    router.back();
  };

  return (
    <TaskForm
      initialTask={task}
      submitLabel="Save Task"
      onSubmit={handleUpdate}
      onCancel={() => router.back()}
      onDelete={handleDelete}
    />
  );
}

const styles = StyleSheet.create({
  missingContainer: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
});

