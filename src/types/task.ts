export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskSource = 'local' | 'api';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: TaskPriority;
  dueDate: string | null;
  createdAt: string;
  completedAt: string | null;
  source: TaskSource;
  externalId?: number;
}

export type TaskFilter = 'all' | 'high' | 'medium' | 'low';

export type DateGroupKey = 'Overdue' | 'Today' | 'Tomorrow' | 'Later' | 'No Due Date';

export interface TaskDateGroup {
  title: DateGroupKey;
  tasks: Task[];
}

export interface CreateTaskInput {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string | null;
}

export interface UpdateTaskInput {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string | null;
}
