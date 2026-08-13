import { createSlice, nanoid } from '@reduxjs/toolkit';

const STORAGE_KEY = 'task-manager:tasks';

/**
 * Load any previously-saved tasks from localStorage.
 * Falls back to an empty array if nothing is saved yet, or if the
 * saved value is corrupted for some reason.
 */
export const loadTasksFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Could not load tasks from localStorage:', err);
    return [];
  }
};

export const PRIORITIES = ['High', 'Medium', 'Low'];
export const FILTERS = ['All', ...PRIORITIES];

const initialState = {
  tasks: loadTasksFromStorage(),
  filter: 'All', // 'All' | 'High' | 'Medium' | 'Low'
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: {
      reducer(state, action) {
        state.tasks.push(action.payload);
      },
      prepare(title, priority) {
        return {
          payload: {
            id: nanoid(),
            title: title.trim(),
            priority,
            completed: false,
          },
        };
      },
    },
    editTask(state, action) {
      const { id, title, priority } = action.payload;
      const task = state.tasks.find((t) => t.id === id);
      if (task) {
        if (title !== undefined) task.title = title.trim();
        if (priority !== undefined) task.priority = priority;
      }
    },
    deleteTask(state, action) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
    toggleComplete(state, action) {
      const task = state.tasks.find((t) => t.id === action.payload);
      if (task) task.completed = !task.completed;
    },
    setFilter(state, action) {
      state.filter = action.payload;
    },
  },
});

export const { addTask, editTask, deleteTask, toggleComplete, setFilter } =
  tasksSlice.actions;

// Selectors
export const selectAllTasks = (state) => state.tasks.tasks;
export const selectFilter = (state) => state.tasks.filter;
export const selectFilteredTasks = (state) => {
  const { tasks, filter } = state.tasks;
  if (filter === 'All') return tasks;
  return tasks.filter((t) => t.priority === filter);
};

export default tasksSlice.reducer;
