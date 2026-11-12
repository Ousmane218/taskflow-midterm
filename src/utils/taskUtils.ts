import { DateGroupKey, Task, TaskDateGroup, TaskFilter } from '@/types/task';

export function formatLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseLocalDateString(dateStr: string | null): Date | null {
  if (!dateStr || !isValidDateString(dateStr)) {
    return null;
  }
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  return new Date(Number(yearStr), Number(monthStr) - 1, Number(dayStr));
}

export function getTodayDateString(): string {
  return formatLocalDateString(new Date());
}

export function getTomorrowDateString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return formatLocalDateString(tomorrow);
}

export function getNextWeekDateString(): string {
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  return formatLocalDateString(nextWeek);
}

export function isValidDateString(value: string): boolean {
  const trimmed = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return false;
  }

  const [yearStr, monthStr, dayStr] = trimmed.split('-');
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const parsed = new Date(year, month - 1, day);
  return (
    parsed.getFullYear() === year &&
    parsed.getMonth() === month - 1 &&
    parsed.getDate() === day
  );
}

export function formatDueDate(dueDate: string | null): string {
  if (!dueDate) {
    return 'No due date';
  }

  const today = getTodayDateString();
  const tomorrow = getTomorrowDateString();

  if (dueDate === today) {
    return 'Today';
  }
  if (dueDate === tomorrow) {
    return 'Tomorrow';
  }

  const localDate = parseLocalDateString(dueDate);
  if (localDate) {
    return localDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return dueDate;
}

export function formatCompletedDate(completedAt: string | null): string {
  if (!completedAt) {
    return 'Completed';
  }

  const parsed = new Date(completedAt);
  if (Number.isNaN(parsed.getTime())) {
    return 'Completed';
  }

  const completedLocalDay = formatLocalDateString(parsed);
  if (completedLocalDay === getTodayDateString()) {
    return `Completed today at ${parsed.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })}`;
  }

  return `Completed ${parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return 'Good morning';
  }
  if (hour < 18) {
    return 'Good afternoon';
  }
  return 'Good evening';
}

export function formatHeaderDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export function isTaskOverdue(task: Task): boolean {
  if (task.completed || !task.dueDate) {
    return false;
  }
  return task.dueDate < getTodayDateString();
}

export interface TodayProgressStats {
  todayTotalCount: number;
  todayCompletedCount: number;
  todayPendingCount: number;
  overdueCount: number;
  percentage: number;
}

/**
 * Calculates daily progress strictly from tasks due today (dueDate === today).
 * Tasks without a due date are not counted as due today.
 */
export function calculateTodayProgress(tasks: Task[]): TodayProgressStats {
  const today = getTodayDateString();
  const todayTasks = tasks.filter((task) => task.dueDate === today);
  const todayTotalCount = todayTasks.length;
  const todayCompletedCount = todayTasks.filter((task) => task.completed).length;
  const todayPendingCount = todayTotalCount - todayCompletedCount;
  const overdueCount = tasks.filter((task) => isTaskOverdue(task)).length;
  const percentage =
    todayTotalCount > 0
      ? Math.round((todayCompletedCount / todayTotalCount) * 100)
      : 0;

  return {
    todayTotalCount,
    todayCompletedCount,
    todayPendingCount,
    overdueCount,
    percentage,
  };
}

/**
 * Returns upcoming pending tasks when no tasks are due today:
 * 1. Next pending tasks with a future due date (sorted earliest first).
 * 2. If none exist, up to `limit` pending tasks without a due date.
 */
export function getUpcomingPendingTasks(tasks: Task[], limit = 3): Task[] {
  const today = getTodayDateString();

  const upcomingDated = tasks
    .filter(
      (task) => !task.completed && task.dueDate !== null && task.dueDate > today
    )
    .sort((a, b) => (a.dueDate ?? '').localeCompare(b.dueDate ?? ''));

  if (upcomingDated.length > 0) {
    return upcomingDated.slice(0, limit);
  }

  return tasks
    .filter((task) => !task.completed && task.dueDate === null)
    .slice(0, limit);
}

/**
 * Filters pending tasks for the Tasks screen by search query and priority filter.
 * Completed tasks are displayed in the Completed tab.
 */
export function filterTasks(
  tasks: Task[],
  searchQuery: string,
  activeFilter: TaskFilter
): Task[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return tasks.filter((task) => {
    if (task.completed) {
      return false;
    }

    const matchesSearch =
      normalizedQuery.length === 0 ||
      task.title.toLowerCase().includes(normalizedQuery);

    if (!matchesSearch) {
      return false;
    }

    switch (activeFilter) {
      case 'high':
      case 'medium':
      case 'low':
        return task.priority === activeFilter;
      case 'all':
      default:
        return true;
    }
  });
}

export function groupTasksByDate(tasks: Task[]): TaskDateGroup[] {
  const today = getTodayDateString();
  const tomorrow = getTomorrowDateString();

  const buckets: Record<DateGroupKey, Task[]> = {
    Overdue: [],
    Today: [],
    Tomorrow: [],
    Later: [],
    'No Due Date': [],
  };

  // Only pending tasks are grouped; completed tasks belong in the Completed tab
  for (const task of tasks) {
    if (task.completed) {
      continue;
    }

    if (!task.dueDate) {
      buckets['No Due Date'].push(task);
    } else if (task.dueDate < today) {
      buckets.Overdue.push(task);
    } else if (task.dueDate === today) {
      buckets.Today.push(task);
    } else if (task.dueDate === tomorrow) {
      buckets.Tomorrow.push(task);
    } else {
      buckets.Later.push(task);
    }
  }

  const orderedKeys: DateGroupKey[] = [
    'Overdue',
    'Today',
    'Tomorrow',
    'Later',
    'No Due Date',
  ];

  return orderedKeys
    .map((key) => ({
      title: key,
      tasks: buckets[key],
    }))
    .filter((group) => group.tasks.length > 0);
}
