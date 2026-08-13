import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask, PRIORITIES } from '../redux/tasksSlice';
import '../styles/TaskForm.css';

function TaskForm() {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title cannot be empty.');
      return;
    }
    dispatch(addTask(title, priority));
    setTitle('');
    setPriority('Medium');
    setError('');
  };

  return (
    <form className="card task-form" onSubmit={handleSubmit}>
      <div className="task-form__row">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError('');
          }}
          className="task-form__input"
          aria-label="Task title"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="task-form__select"
          aria-label="Task priority"
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <button type="submit" className="task-form__button">
          Add Task
        </button>
      </div>
      {error && <p className="task-form__error">{error}</p>}
    </form>
  );
}

export default TaskForm;
