import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { ClipboardList, Plus, Search, X } from 'lucide-react-native';
import { EmptyState } from '@/components/EmptyState';
import { TaskRow } from '@/components/TaskRow';
import { ICON_SIZE, ICON_STROKE, RADIUS, SPACING } from '@/constants/theme';
import { useTasks } from '@/context/TaskContext';
import { useTheme } from '@/context/ThemeContext';
import { TaskFilter } from '@/types/task';
import { filterTasks, groupTasksByDate } from '@/utils/taskUtils';

const FILTER_CHIPS: { key: TaskFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'high', label: 'High' },
  { key: 'medium', label: 'Medium' },
  { key: 'low', label: 'Low' },
];

export default function TasksScreen() {
  const { tasks, isLoading, toggleTaskCompletion } = useTasks();
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('all');

  const filteredTasks = useMemo(
    () => filterTasks(tasks, searchQuery, activeFilter),
    [tasks, searchQuery, activeFilter]
  );

  const groupedTasks = useMemo(
    () => groupTasksByDate(filteredTasks),
    [filteredTasks]
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top Row: Page Title and Add Task Button */}
        <View style={styles.titleRow}>
          <View>
            <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>
              All Tasks
            </Text>
            <Text style={[styles.pageSubtitle, { color: colors.textSecondary }]}>
              {filteredTasks.length}{' '}
              {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </Text>
          </View>

          <Pressable
            onPress={() => router.push('/task/new')}
            style={({ pressed }) => [
              styles.addButton,
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Plus size={ICON_SIZE.sm} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.addButtonText}>Add Task</Text>
          </Pressable>
        </View>

        {/* Search Input */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Search
            size={ICON_SIZE.sm}
            color={colors.textSecondary}
            strokeWidth={ICON_STROKE}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search tasks by title..."
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            style={[styles.searchInput, { color: colors.textPrimary }]}
          />
          {searchQuery.length > 0 ? (
            <Pressable
              onPress={() => setSearchQuery('')}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <X
                size={ICON_SIZE.sm}
                color={colors.textSecondary}
                strokeWidth={ICON_STROKE}
              />
            </Pressable>
          ) : null}
        </View>

        {/* Compact Pill Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTER_CHIPS.map((chip) => {
            const selected = activeFilter === chip.key;
            return (
              <Pressable
                key={chip.key}
                onPress={() => setActiveFilter(chip.key)}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: selected ? colors.primary : colors.surface,
                    borderColor: selected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: selected ? '#FFFFFF' : colors.textSecondary,
                    },
                  ]}
                >
                  {chip.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Grouped Task List */}
        {tasks.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No tasks yet"
            description="Tap Add Task above or import sample tasks from Settings."
          />
        ) : groupedTasks.length === 0 &&
          searchQuery.trim().length === 0 &&
          activeFilter === 'all' ? (
          <EmptyState
            icon={ClipboardList}
            title="No pending tasks"
            description="All your tasks are completed. View them in the Completed tab."
          />
        ) : groupedTasks.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No matching tasks"
            description="Try adjusting your search query or selected filter."
            actionLabel="Reset Filters"
            onAction={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
          />
        ) : (
          <View style={styles.groupsWrapper}>
            {groupedTasks.map((group) => {
              const isOverdueGroup = group.title === 'Overdue';
              return (
                <View key={group.title} style={styles.groupSection}>
                  <View style={styles.groupHeader}>
                    <Text
                      style={[
                        styles.groupTitle,
                        {
                          color: isOverdueGroup
                            ? colors.overdue
                            : colors.textSecondary,
                        },
                      ]}
                    >
                      {group.title}
                    </Text>
                    <Text
                      style={[
                        styles.groupCount,
                        {
                          color: isOverdueGroup
                            ? colors.overdue
                            : colors.textSecondary,
                        },
                      ]}
                    >
                      {group.tasks.length}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.groupList,
                      { borderColor: colors.border },
                    ]}
                  >
                    {group.tasks.map((task, idx) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onToggle={toggleTaskCompletion}
                        isLast={idx === group.tasks.length - 1}
                      />
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
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
  flex: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.md,
    paddingBottom: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  pageSubtitle: {
    fontSize: 13,
    marginTop: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: RADIUS.button,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.input,
    borderWidth: StyleSheet.hairlineWidth,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 15,
  },
  filterRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingVertical: 2,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  groupsWrapper: {
    gap: SPACING.lg,
    marginTop: SPACING.xs,
  },
  groupSection: {
    gap: 6,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  groupCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  groupList: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
