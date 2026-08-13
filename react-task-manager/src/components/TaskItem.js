import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  toggleComplete,
  deleteTask,
  editTask,
  PRIORITIES,
} from '../redux/tasksSlice';
import '../styles/TaskItem.css';

const PRIORITY_CLASS = {
  High: 'task-item__badge--high',
  Medium: 'task-item__badge--medium',
  Low: 'task-item__badge--low',
};

function TaskItem({ task }) {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title);
  const [draftPriority, setDraftPriority] = useState(task.priority);

  const startEdit = () => {
    setDraftTitle(task.title);
    setDraftPriority(task.priority);
    setIsEditing(true);
  };

  const cancelEdit = () => setIsEditing(false);

  const saveEdit = (e) => {
    e.preventDefault();
    if (!draftTitle.trim()) return;
    dispatch(
      editTask({ id: task.id, title: draftTitle, priority: draftPriority })
    );
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="card task-item">
        <form className="task-item__edit-form" onSubmit={saveEdit}>
          <input
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            autoFocus
            className="task-item__edit-input"
          />
          <select
            value={draftPriority}
            onChange={(e) => setDraftPriority(e.target.value)}
            className="task-item__edit-select"
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <button type="submit" className="task-item__btn task-item__btn--save">
            Save
          </button>
          <button
            type="button"
            className="task-item__btn"
            onClick={cancelEdit}
          >
            Cancel
          </button>
        </form>
      </li>
    );
  }

  return (
    <li className={`card task-item${task.completed ? ' task-item--done' : ''}`}>
      <label className="task-item__checkbox-wrap">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => dispatch(toggleComplete(task.id))}
        />
      </label>

      <span className="task-item__title">{task.title}</span>

      <span className={`task-item__badge ${PRIORITY_CLASS[task.priority]}`}>
        {task.priority}
      </span>

      <div className="task-item__actions">
        <button className="task-item__btn" onClick={startEdit}>
          Edit
        </button>
        <button
          className="task-item__btn task-item__btn--danger"
          onClick={() => dispatch(deleteTask(task.id))}
        >
          Delete
        </button>
      </div>
    </li>
  );
}

export default TaskItem;
