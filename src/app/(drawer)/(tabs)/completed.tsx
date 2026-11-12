import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { CheckCircle2 } from 'lucide-react-native';
import { EmptyState } from '@/components/EmptyState';
import { TaskRow } from '@/components/TaskRow';
import { SPACING } from '@/constants/theme';
import { useTasks } from '@/context/TaskContext';
import { useTheme } from '@/context/ThemeContext';

export default function CompletedScreen() {
  const { tasks, isLoading, toggleTaskCompletion } = useTasks();
  const { colors } = useTheme();

  const completedTasks = useMemo(() => {
    return tasks
      .filter((task) => task.completed)
      .sort((a, b) => {
        const timeA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
        const timeB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
        return timeB - timeA;
      });
  }, [tasks]);

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.headerBlock}>
        <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>
          Completed Tasks
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {completedTasks.length}{' '}
          {completedTasks.length === 1 ? 'task' : 'tasks'} completed
        </Text>
      </View>

      {completedTasks.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title="No completed tasks yet"
          description="Tasks you mark as completed will appear here with their completion date."
        />
      ) : (
        <View
          style={[
            styles.listDividerGroup,
            { borderColor: colors.border },
          ]}
        >
          {completedTasks.map((task, index) => (
            <TaskRow
              key={task.id}
              task={task}
              onToggle={toggleTaskCompletion}
              isLast={index === completedTasks.length - 1}
              showCompletedDate
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.lg,
    paddingBottom: 32,
  },
  headerBlock: {
    gap: 2,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
  },
  listDividerGroup: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
