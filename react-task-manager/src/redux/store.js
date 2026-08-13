import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';

const STORAGE_KEY = 'task-manager:tasks';

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
});

// Persist the tasks array to localStorage any time it changes, regardless
// of which action caused the change. Keeping this in one place means new
// actions/reducers automatically stay persisted without extra wiring.
let previousTasks = store.getState().tasks.tasks;
store.subscribe(() => {
  const currentTasks = store.getState().tasks.tasks;
  if (currentTasks !== previousTasks) {
    previousTasks = currentTasks;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentTasks));
    } catch (err) {
      console.warn('Could not save tasks to localStorage:', err);
    }
  }
});

export default store;
