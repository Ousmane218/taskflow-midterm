import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Link, router } from 'expo-router';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Plus,
} from 'lucide-react-native';
import { EmptyState } from '@/components/EmptyState';
import { ProgressSummary } from '@/components/ProgressSummary';
import { TaskRow } from '@/components/TaskRow';
import { ICON_SIZE, ICON_STROKE, RADIUS, SPACING } from '@/constants/theme';
import { useTasks } from '@/context/TaskContext';
import { useTheme } from '@/context/ThemeContext';
import {
  calculateTodayProgress,
  formatHeaderDate,
  getGreeting,
  getTodayDateString,
  getUpcomingPendingTasks,
  isTaskOverdue,
} from '@/utils/taskUtils';

export default function HomeScreen() {
  const { tasks, isLoading, toggleTaskCompletion } = useTasks();
  const { colors } = useTheme();

  const today = getTodayDateString();

  // Progress is calculated strictly from tasks due today
  const stats = useMemo(() => calculateTodayProgress(tasks), [tasks]);

  // Only pending tasks with dueDate < today
  const overdueTasks = useMemo(
    () => tasks.filter((task) => isTaskOverdue(task)),
    [tasks]
  );

  // Pending tasks scheduled specifically for today
  const todaysPendingTasks = useMemo(
    () => tasks.filter((task) => !task.completed && task.dueDate === today),
    [tasks, today]
  );

  // Used when no pending tasks are due today: next dated tasks, or up to 3 unscheduled pending tasks
  const upcomingTasks = useMemo(
    () => getUpcomingPendingTasks(tasks, 3),
    [tasks]
  );

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

  const showTodaySection =
    todaysPendingTasks.length > 0 || stats.todayTotalCount > 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.greetingBlock}>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            {formatHeaderDate()}
          </Text>
          <Text style={[styles.greetingText, { color: colors.textPrimary }]}>
            {getGreeting()}
          </Text>
        </View>

        <Pressable
          onPress={() => router.push('/task/new')}
          style={({ pressed }) => [
            styles.newTaskButton,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Plus size={ICON_SIZE.sm} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.newTaskButtonText}>New Task</Text>
        </Pressable>
      </View>

      {/* Compact Daily Progress Panel */}
      <ProgressSummary stats={stats} />

      {/* Overdue Section (only shown when pending overdue tasks exist) */}
      {overdueTasks.length > 0 ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.overdue }]}>
              Overdue ({overdueTasks.length})
            </Text>
          </View>

          <View
            style={[
              styles.listDividerGroup,
              { borderColor: colors.border },
            ]}
          >
            {overdueTasks.map((task, index) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={toggleTaskCompletion}
                isLast={index === overdueTasks.length - 1}
              />
            ))}
          </View>
        </View>
      ) : null}

      {/* Today's Pending Tasks (when tasks are scheduled for today) */}
      {showTodaySection ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Today&apos;s Pending ({todaysPendingTasks.length})
            </Text>
            <Link href="/tasks" asChild>
              <Pressable style={styles.viewAllLink} hitSlop={8}>
                <Text style={[styles.viewAllText, { color: colors.primary }]}>
                  All tasks
                </Text>
                <ArrowRight
                  size={14}
                  color={colors.primary}
                  strokeWidth={ICON_STROKE}
                />
              </Pressable>
            </Link>
          </View>

          {todaysPendingTasks.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="All done for today"
              description="You have completed all tasks scheduled for today."
            />
          ) : (
            <View
              style={[
                styles.listDividerGroup,
                { borderColor: colors.border },
              ]}
            >
              {todaysPendingTasks.map((task, index) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggle={toggleTaskCompletion}
                  isLast={index === todaysPendingTasks.length - 1}
                />
              ))}
            </View>
          )}
        </View>
      ) : null}

      {/* Upcoming Tasks Section (shown when no tasks are due today) */}
      {!showTodaySection ? (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              Upcoming Tasks
            </Text>
            <Link href="/tasks" asChild>
              <Pressable style={styles.viewAllLink} hitSlop={8}>
                <Text style={[styles.viewAllText, { color: colors.primary }]}>
                  All tasks
                </Text>
                <ArrowRight
                  size={14}
                  color={colors.primary}
                  strokeWidth={ICON_STROKE}
                />
              </Pressable>
            </Link>
          </View>

          {upcomingTasks.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title={tasks.length === 0 ? 'No tasks yet' : 'No upcoming tasks'}
              description={
                tasks.length === 0
                  ? 'Tap New Task above or import sample tasks in Settings.'
                  : 'You have no pending tasks scheduled.'
              }
            />
          ) : (
            <View
              style={[
                styles.listDividerGroup,
                { borderColor: colors.border },
              ]}
            >
              {upcomingTasks.map((task, index) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggle={toggleTaskCompletion}
                  isLast={index === upcomingTasks.length - 1}
                />
              ))}
            </View>
          )}
        </View>
      ) : null}
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
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  greetingBlock: {
    flex: 1,
    gap: 2,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '500',
  },
  greetingText: {
    fontSize: 22,
    fontWeight: '700',
  },
  newTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: RADIUS.button,
  },
  newTaskButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    gap: SPACING.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  viewAllLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listDividerGroup: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
