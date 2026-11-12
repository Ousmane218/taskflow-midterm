import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { AlertCircle, Calendar, Trash2, X } from 'lucide-react-native';
import { ICON_SIZE, ICON_STROKE, RADIUS, SPACING } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { CreateTaskInput, Task, TaskPriority } from '@/types/task';
import {
  formatDueDate,
  formatLocalDateString,
  getNextWeekDateString,
  getTodayDateString,
  getTomorrowDateString,
  parseLocalDateString,
} from '@/utils/taskUtils';

interface TaskFormProps {
  initialTask?: Task;
  submitLabel: string;
  onSubmit: (values: CreateTaskInput) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

const PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export function TaskForm({
  initialTask,
  submitLabel,
  onSubmit,
  onCancel,
  onDelete,
}: TaskFormProps) {
  const { colors, isDark } = useTheme();

  const [title, setTitle] = useState<string>(initialTask?.title ?? '');
  const [description, setDescription] = useState<string>(
    initialTask?.description ?? ''
  );
  const [dueDate, setDueDate] = useState<string | null>(
    initialTask?.dueDate ?? null
  );
  const [priority, setPriority] = useState<TaskPriority>(
    initialTask?.priority ?? 'medium'
  );
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<boolean>(false);

  const todayStr = getTodayDateString();
  const tomorrowStr = getTomorrowDateString();
  const nextWeekStr = getNextWeekDateString();

  // Convert stored YYYY-MM-DD into a local Date object for the native picker
  const pickerDateValue = parseLocalDateString(dueDate) ?? new Date();

  const handleDatePickerChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (event.type === 'dismissed') {
      return;
    }

    if (selectedDate) {
      setDueDate(formatLocalDateString(selectedDate));
    }
  };

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setErrorMessage('Please enter a task title.');
      return;
    }

    setErrorMessage(null);
    onSubmit({
      title: trimmedTitle,
      description: description.trim(),
      priority,
      dueDate,
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {errorMessage ? (
          <View
            style={[
              styles.errorBanner,
              {
                backgroundColor: colors.overdueMuted,
                borderColor: colors.overdue,
              },
            ]}
          >
            <AlertCircle
              size={ICON_SIZE.sm}
              color={colors.overdue}
              strokeWidth={ICON_STROKE}
            />
            <Text style={[styles.errorText, { color: colors.overdue }]}>
              {errorMessage}
            </Text>
          </View>
        ) : null}

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>
            Title <Text style={{ color: colors.overdue }}>*</Text>
          </Text>
          <TextInput
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (errorMessage) {
                setErrorMessage(null);
              }
            }}
            placeholder="e.g., Prepare midterm presentation"
            placeholderTextColor={colors.textSecondary}
            style={[
              styles.input,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.textPrimary,
              },
            ]}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>
            Description (optional)
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Add notes, requirements, or details..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.textPrimary,
              },
            ]}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>
            Priority
          </Text>
          <View style={styles.priorityRow}>
            {PRIORITIES.map((option) => {
              const selected = priority === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setPriority(option.value)}
                  style={[
                    styles.priorityOption,
                    {
                      backgroundColor: selected
                        ? colors.primary
                        : colors.surface,
                      borderColor: selected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityOptionText,
                      {
                        color: selected ? '#FFFFFF' : colors.textPrimary,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.textPrimary }]}>
            Due Date (optional)
          </Text>

          {/* Quick-Select Date Shortcuts */}
          <View style={styles.quickDateRow}>
            {[
              { label: 'Today', value: todayStr },
              { label: 'Tomorrow', value: tomorrowStr },
              { label: 'Next Week', value: nextWeekStr },
              { label: 'No Date', value: null },
            ].map((chip) => {
              const isSelected = dueDate === chip.value;
              return (
                <Pressable
                  key={chip.label}
                  onPress={() => {
                    setDueDate(chip.value);
                    if (chip.value === null) {
                      setShowDatePicker(false);
                    }
                  }}
                  style={[
                    styles.dateChip,
                    {
                      backgroundColor: isSelected
                        ? colors.primary
                        : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dateChipText,
                      {
                        color: isSelected ? '#FFFFFF' : colors.textSecondary,
                      },
                    ]}
                  >
                    {chip.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Native Date Picker Trigger Row */}
          <View
            style={[
              styles.dateSelectorButton,
              {
                backgroundColor: colors.surface,
                borderColor: showDatePicker ? colors.primary : colors.border,
              },
            ]}
          >
            <Pressable
              onPress={() => {
                if (!dueDate) {
                  setDueDate(todayStr);
                }
                setShowDatePicker((prev) => !prev);
              }}
              style={styles.dateSelectorLeft}
            >
              <Calendar
                size={ICON_SIZE.sm}
                color={dueDate ? colors.primary : colors.textSecondary}
                strokeWidth={ICON_STROKE}
              />
              <Text
                style={[
                  styles.dateSelectorText,
                  {
                    color: dueDate ? colors.textPrimary : colors.textSecondary,
                  },
                ]}
              >
                {dueDate
                  ? `${formatDueDate(dueDate)} (${dueDate})`
                  : 'Select custom date...'}
              </Text>
            </Pressable>

            {dueDate ? (
              <Pressable
                onPress={() => {
                  setDueDate(null);
                  setShowDatePicker(false);
                }}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel="Clear due date"
              >
                <X
                  size={ICON_SIZE.sm}
                  color={colors.textSecondary}
                  strokeWidth={ICON_STROKE}
                />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  setDueDate(todayStr);
                  setShowDatePicker(true);
                }}
              >
                <Text style={[styles.chooseLink, { color: colors.primary }]}>
                  Pick Date
                </Text>
              </Pressable>
            )}
          </View>

          {/* Native DateTimePicker */}
          {showDatePicker ? (
            <View
              style={[
                styles.pickerContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              {Platform.OS === 'ios' ? (
                <View
                  style={[
                    styles.pickerHeader,
                    { borderBottomColor: colors.border },
                  ]}
                >
                  <Text
                    style={[
                      styles.pickerHeaderLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Select Due Date
                  </Text>
                  <Pressable
                    onPress={() => setShowDatePicker(false)}
                    hitSlop={8}
                  >
                    <Text
                      style={[styles.pickerDoneText, { color: colors.primary }]}
                    >
                      Done
                    </Text>
                  </Pressable>
                </View>
              ) : null}

              <DateTimePicker
                value={pickerDateValue}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                accentColor={colors.primary}
                themeVariant={isDark ? 'dark' : 'light'}
                onChange={handleDatePickerChange}
              />
            </View>
          ) : null}
        </View>

        <View style={styles.actionGroup}>
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: colors.primary,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={styles.primaryButtonText}>{submitLabel}</Text>
          </Pressable>

          <Pressable
            onPress={onCancel}
            style={({ pressed }) => [
              styles.secondaryButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.secondaryButtonText,
                { color: colors.textPrimary },
              ]}
            >
              Cancel
            </Text>
          </Pressable>
        </View>

        {onDelete ? (
          <View
            style={[
              styles.deleteSection,
              { borderTopColor: colors.border },
            ]}
          >
            {!confirmingDelete ? (
              <Pressable
                onPress={() => setConfirmingDelete(true)}
                style={({ pressed }) => [
                  styles.deleteButton,
                  {
                    backgroundColor: colors.overdueMuted,
                    borderColor: colors.overdue,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Trash2
                  size={ICON_SIZE.sm}
                  color={colors.overdue}
                  strokeWidth={ICON_STROKE}
                />
                <Text
                  style={[styles.deleteButtonText, { color: colors.overdue }]}
                >
                  Delete Task
                </Text>
              </Pressable>
            ) : (
              <View
                style={[
                  styles.confirmCard,
                  {
                    backgroundColor: colors.overdueMuted,
                    borderColor: colors.overdue,
                  },
                ]}
              >
                <Text
                  style={[styles.confirmTitle, { color: colors.textPrimary }]}
                >
                  Delete this task permanently?
                </Text>
                <Text
                  style={[
                    styles.confirmSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  This action cannot be undone.
                </Text>
                <View style={styles.confirmActions}>
                  <Pressable
                    onPress={() => setConfirmingDelete(false)}
                    style={[
                      styles.confirmCancelBtn,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.confirmCancelText,
                        { color: colors.textPrimary },
                      ]}
                    >
                      Keep Task
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={onDelete}
                    style={[
                      styles.confirmDeleteBtn,
                      { backgroundColor: colors.overdue },
                    ]}
                  >
                    <Text style={styles.confirmDeleteText}>
                      Confirm Delete
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.xl,
    paddingBottom: 40,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderRadius: RADIUS.input,
    borderWidth: StyleSheet.hairlineWidth,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  fieldGroup: {
    gap: SPACING.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: RADIUS.input,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    fontSize: 15,
  },
  textArea: {
    minHeight: 92,
    paddingTop: 12,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  priorityOption: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: RADIUS.button,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickDateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  dateChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  dateChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dateSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: RADIUS.input,
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
  },
  dateSelectorLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  dateSelectorText: {
    fontSize: 15,
    fontWeight: '500',
  },
  chooseLink: {
    fontSize: 13,
    fontWeight: '600',
  },
  pickerContainer: {
    borderRadius: RADIUS.card,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    paddingHorizontal: SPACING.xs,
    paddingBottom: SPACING.xs,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pickerHeaderLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  pickerDoneText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionGroup: {
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: RADIUS.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 13,
    borderRadius: RADIUS.button,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  deleteSection: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: 13,
    borderRadius: RADIUS.button,
    borderWidth: StyleSheet.hairlineWidth,
  },
  deleteButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  confirmCard: {
    padding: SPACING.lg,
    borderRadius: RADIUS.card,
    borderWidth: StyleSheet.hairlineWidth,
    gap: SPACING.xs,
  },
  confirmTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  confirmSubtitle: {
    fontSize: 13,
    marginBottom: SPACING.sm,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  confirmCancelBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.button,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  confirmCancelText: {
    fontSize: 14,
    fontWeight: '600',
  },
  confirmDeleteBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.button,
    alignItems: 'center',
  },
  confirmDeleteText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
