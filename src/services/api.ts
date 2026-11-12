import { Task, TaskPriority } from '@/types/task';

const TODOS_API_URL = 'https://jsonplaceholder.typicode.com/todos?userId=1';

interface ExternalTodoItem {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface StudentTaskTemplate {
  title: string;
  description: string;
  priority: TaskPriority;
}

/**
 * Predefined realistic student tasks mapped onto the first 5 records
 * returned by the JSONPlaceholder todos endpoint.
 */
const STUDENT_SAMPLE_TASKS: StudentTaskTemplate[] = [
  {
    title: 'Complete Mobile Development midterm',
    description: 'Finish and test the TaskFlow mobile application.',
    priority: 'high',
  },
  {
    title: 'Read Data Visualization book',
    description: 'Read pages 134–180 and take notes.',
    priority: 'medium',
  },
  {
    title: 'Review Operating Systems',
    description: 'Revise process scheduling and memory management.',
    priority: 'high',
  },
  {
    title: 'Prepare Data Mining presentation',
    description: 'Review the project slides and practice the explanation.',
    priority: 'medium',
  },
  {
    title: 'Organize weekly study schedule',
    description: 'Plan study sessions and assignment deadlines.',
    priority: 'low',
  },
];

function isValidExternalTodo(item: unknown): item is ExternalTodoItem {
  if (typeof item !== 'object' || item === null) {
    return false;
  }

  const record = item as Record<string, unknown>;
  return (
    typeof record.userId === 'number' &&
    typeof record.id === 'number' &&
    typeof record.title === 'string' &&
    record.title.trim().length > 0 &&
    typeof record.completed === 'boolean'
  );
}

export async function fetchSampleTasksFromApi(): Promise<Task[]> {
  try {
    const response = await fetch(TODOS_API_URL);

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      throw new Error(
        'Invalid API response format: expected an array of todos.'
      );
    }

    const validItems = data.filter(isValidExternalTodo);
    if (validItems.length === 0) {
      throw new Error('No valid todo items found in the API response.');
    }

    // Select at most 5 valid API records belonging to userId 1
    const selectedTodos = validItems
      .filter((todo) => todo.userId === 1)
      .slice(0, STUDENT_SAMPLE_TASKS.length);

    const nowIso = new Date().toISOString();

    return selectedTodos.map((todo, index) => {
      const template = STUDENT_SAMPLE_TASKS[index];
      return {
        id: `api-${todo.id}-${Date.now()}`,
        title: template.title,
        description: template.description,
        completed: false,
        priority: template.priority,
        dueDate: null,
        createdAt: nowIso,
        completedAt: null,
        source: 'api',
        externalId: todo.id,
      };
    });
  } catch (error) {
    console.error('Failed to fetch sample tasks from API:', error);
    throw error;
  }
}
