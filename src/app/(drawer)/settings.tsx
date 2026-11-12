import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { ICON_SIZE, ICON_STROKE, RADIUS, SPACING } from '@/constants/theme';
import { useTasks } from '@/context/TaskContext';
import { useTheme } from '@/context/ThemeContext';

export default function SettingsScreen() {
  const { colors, resetTheme } = useTheme();
  const { importTasks, clearAllTasks, tasks } = useTasks();

  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  const handleImportSampleTasks = async () => {
    setIsImporting(true);
    setFeedback(null);
    setResetError(null);

    try {
      const result = await importTasks();
      if (result.addedCount > 0) {
        setFeedback({
          type: 'success',
          message: `Imported ${result.addedCount} sample ${
            result.addedCount === 1 ? 'task' : 'tasks'
          }.`,
        });
      } else {
        setFeedback({
          type: 'success',
          message: 'Sample tasks are already in your list.',
        });
      }
    } catch (error) {
      console.error('Sample tasks import failed:', error);
      setFeedback({
        type: 'error',
        message: 'Could not import sample tasks. Check your connection and try again.',
      });
    } finally {
      setIsImporting(false);
    }
  };

  const performReset = async () => {
    setResetError(null);
    try {
      await clearAllTasks();
      await resetTheme();
      setFeedback(null);
    } catch (error) {
      console.error('Failed to reset demo data:', error);
      setResetError('Could not reset demo data. Please try again.');
    }
  };

  const handleResetDemoData = () => {
    Alert.alert(
      'Reset Demo Data',
      'All saved tasks, including completed tasks, will be permanently deleted and the theme will be restored to Light Mode.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            void performReset();
          },
        },
      ]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Section 1: Sample Data */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
          Sample Data
        </Text>
        <View
          style={[
            styles.groupBox,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Import Sample Tasks
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Import up to 5 sample tasks from JSONPlaceholder.
          </Text>

          <Pressable
            onPress={handleImportSampleTasks}
            disabled={isImporting}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: colors.primary,
                opacity: isImporting ? 0.65 : pressed ? 0.85 : 1,
              },
            ]}
          >
            {isImporting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : null}
            <Text style={styles.buttonText}>
              {isImporting ? 'Importing...' : 'Import Sample Tasks'}
            </Text>
          </Pressable>

          {feedback ? (
            <View style={styles.feedbackRow}>
              <Text
                style={[
                  styles.feedbackText,
                  {
                    color:
                      feedback.type === 'error'
                        ? colors.overdue
                        : colors.completed,
                  },
                ]}
              >
                {feedback.message}
              </Text>
              {feedback.type === 'error' ? (
                <Pressable
                  onPress={handleImportSampleTasks}
                  disabled={isImporting}
                  hitSlop={8}
                >
                  <Text
                    style={[styles.retryLink, { color: colors.primary }]}
                  >
                    Retry
                  </Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>

      {/* Section 2: Local Storage */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
          Local Storage
        </Text>
        <View
          style={[
            styles.groupBox,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.storageHeaderRow}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              Stored on This Device
            </Text>
            <Text style={[styles.countLabel, { color: colors.textSecondary }]}>
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </Text>
          </View>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Your tasks are saved locally and remain available offline.
          </Text>
        </View>
      </View>

      {/* Section 3: Information */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
          Information
        </Text>
        <Link href="/about" asChild>
          <Pressable
            style={({ pressed }) => [
              styles.groupBox,
              styles.linkRow,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              About TaskFlow
            </Text>
            <ChevronRight
              size={ICON_SIZE.md}
              color={colors.textSecondary}
              strokeWidth={ICON_STROKE}
            />
          </Pressable>
        </Link>
      </View>

      {/* Section 4: Demonstration */}
      <View style={styles.section}>
        <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>
          Demonstration
        </Text>
        <View
          style={[
            styles.groupBox,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Reset Demo Data
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Clear saved tasks and restore default settings.
          </Text>

          <Pressable
            onPress={handleResetDemoData}
            style={({ pressed }) => [
              styles.resetButton,
              {
                borderColor: colors.overdue,
                backgroundColor: colors.overdueMuted,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <Text style={[styles.resetButtonText, { color: colors.overdue }]}>
              Reset Demo Data
            </Text>
          </Pressable>

          {resetError ? (
            <Text style={[styles.feedbackText, { color: colors.overdue }]}>
              {resetError}
            </Text>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.xl,
    paddingBottom: 36,
  },
  section: {
    gap: SPACING.xs,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 4,
  },
  groupBox: {
    padding: SPACING.lg,
    borderRadius: RADIUS.card,
    borderWidth: StyleSheet.hairlineWidth,
    gap: SPACING.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
    paddingVertical: 12,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.button,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  resetButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xs,
    paddingVertical: 12,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.button,
    borderWidth: StyleSheet.hairlineWidth,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    marginTop: 2,
  },
  feedbackText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  retryLink: {
    fontSize: 13,
    fontWeight: '600',
  },
  storageHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
