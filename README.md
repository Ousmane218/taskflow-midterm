# TaskFlow

**TaskFlow** is a clean, minimal personal task management mobile application built with **React Native**, **Expo**, **TypeScript**, and **Expo Router**.

---

## 1. Academic Project Context

TaskFlow was created as a university **Mobile Development Midterm Project**. The codebase is intentionally structured around core mobile development fundamentals without adding unnecessary state-management frameworks or custom backend servers:

- **Nested Navigation**: Bottom Tabs (`Home`, `Tasks`, `Completed`) nested inside a Drawer navigator (`Main Tabs`, `Settings`, `About`) using **Expo Router**.
- **React Context API**: Global state managed through two contexts (`TaskContext` and `ThemeContext`) and custom hooks (`useTasks()` and `useTheme()`).
- **Dark and Light Theme**: Instant theme switching directly inside the navigation drawer, backed by shared theme tokens (`src/constants/theme.ts`).
- **Local Storage**: Persistent device storage for both tasks and theme preference using **`@react-native-async-storage/async-storage`**.
- **REST API Integration**: Live sample task import from `https://jsonplaceholder.typicode.com/todos?userId=1` using the native **`fetch()`** API.
- **React Hooks**: Practical usage of `useState`, `useEffect`, `useContext`, `useMemo`, and `useCallback`.

---

## 2. Features

- **Home Dashboard**:
  - Displays the current date, a time-based greeting (`Good morning`, `Good afternoon`, `Good evening`), and a single **New Task** button.
  - Compact **Today's Progress** indicator calculating completion percentage strictly from tasks due today (`dueDate === today`).
  - **Overdue** task section (automatically shown when pending overdue tasks exist).
  - **Today's Pending** tasks list, or a compact **Upcoming Tasks** section (showing up to 3 next pending dated or unscheduled tasks) when no tasks are due today.
- **Tasks Screen**:
  - Live **Search** by task title.
  - Compact pill-shaped **Filter Chips** (`All`, `High`, `Medium`, `Low`).
  - Automatic grouping of pending tasks into mutually exclusive date sections: **`Overdue`**, **`Today`**, **`Tomorrow`**, **`Later`**, and **`No Due Date`** (only non-empty groups are shown).
  - Compact task rows separated by subtle dividers with completion checkboxes, due dates, and priority indicators.
- **Completed Screen**:
  - Displays completed tasks sorted by completion date, with a one-tap **Pending** button (or checkbox) to reopen any task.
- **Reusable Add / Edit Task Form**:
  - Shared `<TaskForm />` component for creating (`/task/new`) and editing (`/task/[id]`) tasks.
  - Fields: **Title** (required with validation), **Description** (optional), **Priority** (`Low`, `Medium`, `High`), and **Due Date** (optional).
  - Includes quick date shortcuts (`Today`, `Tomorrow`, `Next Week`, `No Date`) plus a native system date picker (`@react-native-community/datetimepicker`) handling local `YYYY-MM-DD` dates without timezone shifts.
  - Includes **Delete Task** with an inline confirmation prompt in edit mode.
- **Drawer & Preferences**:
  - Slide-out drawer featuring the TaskFlow header, navigation links (`Main Tabs`, `Settings`, `About`), a **Dark Mode** native `Switch` under Preferences, and the version footer (`TaskFlow v1.0.0`).
- **Settings & About**:
  - **Settings**:
    - **Import Sample Tasks**: Fetches 5 real todo records from JSONPlaceholder (`https://jsonplaceholder.typicode.com/todos?userId=1`), maps them onto 5 predefined realistic student study tasks while keeping their API `externalId`s, and provides loading, duplicate prevention, and error/retry feedback.
    - **Local Storage**: Displays the live count of tasks saved locally on the device.
    - **Information**: Links to **About TaskFlow**.
    - **Demonstration (Reset Demo Data)**: Prompts with a native confirmation dialog before clearing TaskFlow's saved tasks, resetting the theme to Light Mode, and clearing import feedback for live midterm demonstrations.
  - **About**: Concise summary of the application, academic purpose, and technology stack.

---

## 3. Technologies

- **React Native & Expo** (SDK 58)
- **TypeScript** (`strict` mode)
- **Expo Router** (`Stack`, `Drawer`, and `Tabs`)
- **React Context API** (`TaskContext` & `ThemeContext`)
- **AsyncStorage** (`@react-native-async-storage/async-storage`)
- **Native Date Picker** (`@react-native-community/datetimepicker`)
- **REST API with `fetch()`** (`https://jsonplaceholder.typicode.com/todos?userId=1`)
- **React Native `StyleSheet`**
- **Lucide Icons** (`lucide-react-native` & `react-native-svg`)

---

## 4. Installation & Running with Expo

### Prerequisites
- **Node.js** (LTS)
- **iOS Simulator** (macOS with Xcode), **Android Emulator**, or the **Expo Go** app on a physical device.

### Installation

```bash
git clone <your-repo-url>
cd taskflow
npm install
```

### Running the Application

```bash
npx expo start
```

- Press **`i`** to open in the iOS Simulator.
- Press **`a`** to open in the Android Emulator.
- Or scan the QR code with **Expo Go** (use `npx expo start --tunnel` if your phone and computer are on a restricted Wi-Fi network).

### Validation Commands

```bash
npx tsc --noEmit     # TypeScript typechecking
npx expo lint        # ESLint code quality check
npx expo-doctor      # Expo dependency and project configuration check
```

---

## 5. Architecture & Implementation Details

### Navigation Structure (`src/app/`)
1. **Root Stack (`src/app/_layout.tsx`)**: Wraps the application in `<ThemeProvider>` and `<TaskProvider>` and configures a native Stack containing `(drawer)` as the root screen and `/task/new` + `/task/[id]` as card screens with clean back navigation (`headerBackButtonDisplayMode: 'minimal'`).
2. **Drawer Navigator (`src/app/(drawer)/_layout.tsx`)**: Renders `CustomDrawerContent` with the TaskFlow header, navigation links (`Main Tabs`, `Settings`, `About`), the **Dark Mode** switch, and the version footer.
3. **Bottom Tabs Navigator (`src/app/(drawer)/(tabs)/_layout.tsx`)**: Primary navigation bar for task screens (`Home`, `Tasks`, `Completed`), with a top-left Lucide `Menu` button that toggles the drawer.

### Context API Implementation (`src/context/`)
- **`TaskContext.tsx`**: Manages `tasks` and `isLoading`, and provides `addTask`, `updateTask`, `deleteTask`, `toggleTaskCompletion`, `importTasks`, and `clearAllTasks` via the `useTasks()` hook.
- **`ThemeContext.tsx`**: Manages `theme` (`'light' | 'dark'`), `colors`, `isDark`, `toggleTheme`, and `resetTheme` via the `useTheme()` hook.

### Local Storage (`src/services/storage.ts`)
- Persists tasks under `@taskflow_tasks_v1` and theme mode under `@taskflow_theme_v1` in `AsyncStorage`.
- Validates stored tasks on load (`isValidTask`) and uses an `isLoading` guard in `TaskContext` so the initial empty state never overwrites saved tasks before startup loading completes.
- When **Reset Demo Data** is confirmed, `clearTasksFromStorage()` and `resetThemeInStorage()` update only TaskFlow's owned storage keys (`@taskflow_tasks_v1` and `@taskflow_theme_v1`) rather than calling `AsyncStorage.clear()`.

### REST API Integration (`src/services/api.ts`)
- Calls `fetch('https://jsonplaceholder.typicode.com/todos?userId=1')`, checks `response.ok`, validates the JSON array, and selects the first 5 valid records for `userId === 1`.
- Because JSONPlaceholder returns Latin placeholder titles, `fetchSampleTasksFromApi()` maps those 5 validated API records onto predefined realistic student tasks (`STUDENT_SAMPLE_TASKS`) while preserving each record's real `externalId` (`todo.id`), `source: 'api'`, `completed: false`, and `dueDate: null`.
- Deduplicates imported tasks by `externalId` inside `TaskContext.importTasks()` and saves them locally to `AsyncStorage` so they can be edited, completed, and deleted offline.

### React Hooks Used
- **`useState`**: Local form state (`TaskForm`), search/filter state (`TasksScreen`), API import status (`SettingsScreen`), and provider state (`TaskContext`, `ThemeContext`).
- **`useEffect`**: Restores saved tasks and theme from `AsyncStorage` on mount, and saves task updates after initial loading finishes.
- **`useContext`**: Used inside `useTasks()` and `useTheme()` to consume shared context values.
- **`useMemo`**: Computes derived today progress stats (`calculateTodayProgress`), overdue tasks, filtered tasks (`filterTasks`), and date groups (`groupTasksByDate`).
- **`useCallback`**: Stabilizes context action functions (`addTask`, `updateTask`, `deleteTask`, `toggleTaskCompletion`, `importTasks`, `toggleTheme`).

---

## 6. Project Structure

```text
taskflow/
├── app.json
├── package.json
├── tsconfig.json
├── README.md
├── PROJECT_EXPLANATION.md
└── src/
    ├── app/
    │   ├── _layout.tsx                 # Root Stack + ThemeProvider & TaskProvider
    │   ├── (drawer)/
    │   │   ├── _layout.tsx             # Drawer navigator + CustomDrawerContent (Dark Mode switch)
    │   │   ├── (tabs)/
    │   │   │   ├── _layout.tsx         # Bottom Tabs navigator (Home, Tasks, Completed)
    │   │   │   ├── index.tsx           # Home screen
    │   │   │   ├── tasks.tsx           # Tasks screen (search, filter chips, date groups)
    │   │   │   └── completed.tsx       # Completed tasks screen
    │   │   ├── settings.tsx            # Settings screen (API sample import & storage info)
    │   │   └── about.tsx               # About screen
    │   └── task/
    │       ├── new.tsx                 # New Task screen
    │       └── [id].tsx                # Edit Task screen
    ├── components/
    │   ├── EmptyState.tsx              # Compact empty state component
    │   ├── ProgressSummary.tsx         # Today's Progress summary bar
    │   ├── TaskForm.tsx                # Reusable create/edit form with native DateTimePicker
    │   └── TaskRow.tsx                 # Compact task row with checkbox and priority dot
    ├── constants/
    │   └── theme.ts                    # Light & Dark color palettes, spacing, and radius tokens
    ├── context/
    │   ├── TaskContext.tsx             # Shared task state, CRUD actions, and API import
    │   └── ThemeContext.tsx            # Shared light/dark theme state
    ├── services/
    │   ├── api.ts                      # Native fetch() request to JSONPlaceholder
    │   └── storage.ts                  # AsyncStorage persistence helpers
    ├── types/
    │   └── task.ts                     # Core Task interface and filter/group types
    └── utils/
        └── taskUtils.ts                # Local date formatting, grouping, filtering, and progress math
```

---

## 7. Screenshots

> Add screenshots captured from your simulator or device here before submitting to GitHub.
