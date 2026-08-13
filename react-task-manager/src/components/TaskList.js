import React from 'react';
import { useSelector } from 'react-redux';
import { selectFilteredTasks, selectFilter } from '../redux/tasksSlice';
import TaskItem from './TaskItem';
import '../styles/TaskList.css';


function TaskList() {
  const tasks = useSelector(selectFilteredTasks);
  const filter = useSelector(selectFilter);

  if (tasks.length === 0) {
    return (
      <div className="card task-list__empty">
        {filter === 'All'
          ? 'No tasks yet — add one above to get started.'
          : `No ${filter} priority tasks.`}
      </div>
    );
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}

export default TaskList;
