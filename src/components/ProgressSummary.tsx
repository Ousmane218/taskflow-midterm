import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { TodayProgressStats } from '@/utils/taskUtils';

interface ProgressSummaryProps {
  stats: TodayProgressStats;
}

export function ProgressSummary({ stats }: ProgressSummaryProps) {
  const { colors } = useTheme();

  const subtitle =
    stats.todayTotalCount === 0
      ? 'No tasks due today'
      : `${stats.todayCompletedCount} of ${stats.todayTotalCount} due today completed`;

  const isComplete =
    stats.todayTotalCount > 0 && stats.percentage === 100;

  return (
    <View
      style={[
        styles.panel,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.textBlock}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Today&apos;s Progress
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        </View>
        <Text
          style={[
            styles.percentage,
            {
              color: isComplete ? colors.completed : colors.textPrimary,
            },
          ]}
        >
          {stats.percentage}%
        </Text>
      </View>

      <View
        style={[
          styles.track,
          { backgroundColor: colors.border },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${stats.percentage}%`,
              backgroundColor: isComplete
                ? colors.completed
                : colors.primary,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    padding: SPACING.lg,
    borderRadius: RADIUS.panel,
    borderWidth: StyleSheet.hairlineWidth,
    gap: SPACING.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
  },
  percentage: {
    fontSize: 20,
    fontWeight: '700',
  },
  track: {
    height: 6,
    borderRadius: RADIUS.pill,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: RADIUS.pill,
  },
});
