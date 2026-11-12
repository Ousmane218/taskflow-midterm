import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode } from '@/constants/theme';
import { Task, TaskPriority, TaskSource } from '@/types/task';

const TASKS_STORAGE_KEY = '@taskflow_tasks_v1';
const THEME_STORAGE_KEY = '@taskflow_theme_v1';

function isValidPriority(value: unknown): value is TaskPriority {
  return value === 'low' || value === 'medium' || value === 'high';
}

function isValidSource(value: unknown): value is TaskSource {
  return value === 'local' || value === 'api';
}

function isValidTask(item: unknown): item is Task {
  if (typeof item !== 'object' || item === null) {
    return false;
  }

  const candidate = item as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.completed === 'boolean' &&
    isValidPriority(candidate.priority) &&
    (typeof candidate.dueDate === 'string' || candidate.dueDate === null) &&
    typeof candidate.createdAt === 'string' &&
    (typeof candidate.completedAt === 'string' || candidate.completedAt === null) &&
    isValidSource(candidate.source) &&
    (candidate.externalId === undefined || typeof candidate.externalId === 'number')
  );
}

export async function loadTasksFromStorage(): Promise<Task[]> {
  try {
    const raw = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isValidTask);
  } catch (error) {
    console.warn('Failed to load tasks from AsyncStorage:', error);
    return [];
  }
}

export async function saveTasksToStorage(tasks: Task[]): Promise<void> {
  try {
    await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.warn('Failed to save tasks to AsyncStorage:', error);
  }
}

export async function clearTasksFromStorage(): Promise<void> {
  await AsyncStorage.removeItem(TASKS_STORAGE_KEY);
}

export async function loadThemeFromStorage(): Promise<ThemeMode | null> {
  try {
    const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    return null;
  } catch (error) {
    console.warn('Failed to load theme from AsyncStorage:', error);
    return null;
  }
}

export async function saveThemeToStorage(theme: ThemeMode): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    console.warn('Failed to save theme to AsyncStorage:', error);
  }
}

export async function resetThemeInStorage(): Promise<void> {
  await AsyncStorage.setItem(THEME_STORAGE_KEY, 'light');
}
