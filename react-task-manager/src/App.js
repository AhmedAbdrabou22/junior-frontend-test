import React from 'react';
import TaskForm from './components/TaskForm';
import FilterBar from './components/FilterBar';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1>Task Manager</h1>
        <p className="app__subtitle">
          Add tasks, set a priority, and track what's done.
        </p>
      </header>

      <main className="app__main">
        <TaskForm />
        <FilterBar />
        <TaskList />
      </main>
    </div>
  );
}

export default App;
