import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Check, ChevronRight, RotateCcw } from 'lucide-react-native';
import { ICON_STROKE, RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { Task, TaskPriority } from '@/types/task';
import {
  formatCompletedDate,
  formatDueDate,
  isTaskOverdue,
} from '@/utils/taskUtils';

interface TaskRowProps {
  task: Task;
  onToggle: (id: string) => void;
  isLast?: boolean;
  showCompletedDate?: boolean;
}

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export function TaskRow({
  task,
  onToggle,
  isLast = false,
  showCompletedDate = false,
}: TaskRowProps) {
  const { colors } = useTheme();
  const overdue = isTaskOverdue(task);

  const getPriorityColor = (priority: TaskPriority): string => {
    switch (priority) {
      case 'high':
        return colors.overdue;
      case 'medium':
        return colors.priorityMediumText;
      case 'low':
      default:
        return colors.textSecondary;
    }
  };

  const priorityColor = getPriorityColor(task.priority);

  const handleOpenTask = () => {
    router.push(`/task/${task.id}`);
  };

  return (
    <View
      style={[
        styles.row,
        !isLast && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <Pressable
        onPress={() => onToggle(task.id)}
        hitSlop={10}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.completed }}
        accessibilityLabel={
          task.completed
            ? `Mark "${task.title}" as pending`
            : `Mark "${task.title}" as completed`
        }
        style={styles.checkboxHitArea}
      >
        <View
          style={[
            styles.checkbox,
            {
              borderColor: task.completed
                ? colors.completed
                : overdue
                ? colors.overdue
                : colors.textSecondary,
              backgroundColor: task.completed
                ? colors.completed
                : 'transparent',
            },
          ]}
        >
          {task.completed ? (
            <Check size={13} color="#FFFFFF" strokeWidth={2.5} />
          ) : null}
        </View>
      </Pressable>

      <Pressable
        onPress={handleOpenTask}
        style={({ pressed }) => [
          styles.contentArea,
          { opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <View style={styles.mainInfo}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              {
                color: task.completed
                  ? colors.textSecondary
                  : overdue
                  ? colors.overdue
                  : colors.textPrimary,
                textDecorationLine: task.completed ? 'line-through' : 'none',
              },
            ]}
          >
            {task.title}
          </Text>

          {showCompletedDate ? (
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {formatCompletedDate(task.completedAt)}
            </Text>
          ) : task.dueDate ? (
            <Text
              style={[
                styles.metaText,
                {
                  color: overdue ? colors.overdue : colors.textSecondary,
                  fontWeight: overdue ? '500' : '400',
                },
              ]}
            >
              {overdue
                ? `Overdue · ${formatDueDate(task.dueDate)}`
                : formatDueDate(task.dueDate)}
            </Text>
          ) : null}
        </View>

        <View style={styles.rightSection}>
          {showCompletedDate ? (
            <Pressable
              onPress={() => onToggle(task.id)}
              style={({ pressed }) => [
                styles.reopenButton,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <RotateCcw
                size={12}
                color={colors.textPrimary}
                strokeWidth={ICON_STROKE}
              />
              <Text style={[styles.reopenText, { color: colors.textPrimary }]}>
                Pending
              </Text>
            </Pressable>
          ) : (
            <View
              style={[
                styles.priorityIndicator,
                { opacity: task.completed ? 0.5 : 1 },
              ]}
            >
              <View
                style={[
                  styles.priorityDot,
                  { backgroundColor: priorityColor },
                ]}
              />
              <Text
                style={[
                  styles.priorityLabel,
                  { color: colors.textSecondary },
                ]}
              >
                {PRIORITY_LABELS[task.priority]}
              </Text>
            </View>
          )}
          <ChevronRight
            size={15}
            color={colors.textSecondary}
            strokeWidth={ICON_STROKE}
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: SPACING.xs,
    gap: SPACING.sm,
  },
  checkboxHitArea: {
    paddingVertical: 4,
    paddingRight: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  mainInfo: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
  },
  metaText: {
    fontSize: 12,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priorityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  priorityDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  priorityLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  reopenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  reopenText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
